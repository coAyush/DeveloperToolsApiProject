package com.DevToolBox.controller; // ← use your own package

import org.springframework.http.HttpHeaders; // HTTP headers for the response
import org.springframework.http.MediaType;  // Content type helpers
import org.springframework.http.ResponseEntity; // Return type for REST method
import org.springframework.web.bind.annotation.*; // Spring annotations
import org.springframework.web.multipart.MultipartFile; // For file upload

import org.apache.pdfbox.Loader; // PDFBox 3: loader utility
import org.apache.pdfbox.pdmodel.PDDocument; // Represents a PDF document
import org.apache.pdfbox.pdmodel.PDPage; // Represents a page in the PDF
import org.apache.pdfbox.pdmodel.PDResources; // Resources (images/forms) on a page
import org.apache.pdfbox.pdmodel.graphics.PDXObject; // Base class for XObjects
import org.apache.pdfbox.pdmodel.graphics.form.PDFormXObject; // Nested form objects
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject; // Embedded images

import javax.imageio.IIOImage; // ImageIO wrapper for writing
import javax.imageio.ImageIO; // Read/Write images
import javax.imageio.ImageWriteParam; // Control JPEG quality
import javax.imageio.ImageWriter; // JPEG writer
import javax.imageio.stream.MemoryCacheImageOutputStream; // In-memory image stream
import java.awt.*; // Graphics2D + RenderingHints
import java.awt.image.BufferedImage; // In-memory bitmap
import java.io.*; // Streams
import java.util.Iterator; // To get an ImageWriter

@RestController // Marks this class as a REST controller
@RequestMapping("/api/pdf") // Base path for endpoints: /api/pdf/*
public class PdfCompressor { // Simple controller class

    // Simple three-level enum from the frontend: low, medium, high
    public enum Level {
        LOW, MEDIUM, HIGH
    } // Compression levels

    @PostMapping("/compress") // POST /api/pdf/compress
    public ResponseEntity<byte[]> compress( // Return the compressed PDF bytes
            @RequestParam("file") MultipartFile file, // the uploaded PDF
            @RequestParam(name = "level", defaultValue = "medium") String level // "low|medium|high"
    ) {
        try { // Start try block to catch errors

            Level lvl = parseLevel(level); // Convert string → enum with defaults
            float scale; // how much to shrink image dimensions
            float quality; // JPEG quality (0..1)

            // Map levels to simple settings (tweak to taste)
            switch (lvl) { // choose settings based on level
                case LOW -> {
                    scale = 0.4f;
                    quality = 0.4f;
                }     // smallest file, most loss
                case HIGH -> {
                    scale = 0.85f;
                    quality = 0.8f;
                }   // biggest file, least loss
                default -> {
                    scale = 0.6f;
                    quality = 0.6f;
                }      // medium is the default
            }

            byte[] output; // final PDF bytes

            // Do the compression in memory
            try (ByteArrayOutputStream out = new ByteArrayOutputStream(); PDDocument doc = Loader.loadPDF(file.getBytes())) {

                // Walk every page and compress images
                for (PDPage page : doc.getPages()) { // loop pages
                    compressResources(page.getResources(), doc, scale, quality); // recurse resources
                }

                doc.save(out); // write compressed PDF into memory
                output = out.toByteArray(); // grab bytes
            }

            // Build a proper HTTP response with a download filename
            HttpHeaders headers = new HttpHeaders(); // new headers
            headers.setContentType(MediaType.APPLICATION_PDF); // set content type
            headers.set(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"compressed.pdf\""); // suggest filename

            return ResponseEntity // return 200 with body + headers
                    .ok()
                    .headers(headers)
                    .body(output);

        } catch (Exception e) { // any error → 400 with message
            return ResponseEntity
                    .badRequest()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("Compression failed: " + e.getMessage()).getBytes());
        }
    }

    private Level parseLevel(String s) { // helper: string → enum
        if (s == null) {
            return Level.MEDIUM; // default
        }
        try {
            return Level.valueOf(s.trim().toUpperCase());
        } // try exact match
        catch (Exception ignore) {
            return Level.MEDIUM;
        } // fallback
    }

    private void compressResources(PDResources res, PDDocument doc, float scale, float quality) throws IOException {
        if (res == null) {
            return; // safety for empty resources
        }
        for (var name : res.getXObjectNames()) { // iterate all XObjects
            PDXObject xo = res.getXObject(name); // get XObject by name

            if (xo instanceof PDImageXObject img) { // if it’s an image…
                PDImageXObject smaller = compressImage(img, doc, scale, quality); // shrink & recompress
                if (smaller != null) { // if we got a result
                    res.put(name, smaller); // replace the original image
                }
            } else if (xo instanceof PDFormXObject form) { // if it’s a nested form…
                compressResources(form.getResources(), doc, scale, quality); // recurse (images may be inside)
            }
        }
    }

    private PDImageXObject compressImage(PDImageXObject img, PDDocument doc, float scale, float quality) throws IOException {
        BufferedImage src = img.getImage(); // read image to Java BufferedImage
        if (src == null) {
            return null; // nothing to do
        }
        int w = Math.max(1, Math.round(src.getWidth() * scale)); // new width
        int h = Math.max(1, Math.round(src.getHeight() * scale)); // new height

        // Create a target RGB image (flatten transparency onto white)
        BufferedImage dst = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB); // allocate
        Graphics2D g = dst.createGraphics(); // get drawing context
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR); // smooth resize
        g.setColor(Color.WHITE); // white background for alpha flatten
        g.fillRect(0, 0, w, h); // paint background
        g.drawImage(src, 0, 0, w, h, null); // draw scaled source
        g.dispose(); // release graphics

        byte[] jpeg = toJpeg(dst, quality); // encode to JPEG bytes at requested quality

        // Wrap the JPEG bytes back into a PDF image object
        return PDImageXObject.createFromByteArray(doc, jpeg, null); // ready to insert
    }

    private byte[] toJpeg(BufferedImage img, float quality) throws IOException {
        Iterator<ImageWriter> it = ImageIO.getImageWritersByFormatName("jpeg"); // find JPEG writer
        if (!it.hasNext()) {
            throw new IOException("No JPEG writer found"); // safety
        }
        ImageWriter writer = it.next(); // pick first writer
        ByteArrayOutputStream baos = new ByteArrayOutputStream(); // in-memory target
        try (MemoryCacheImageOutputStream ios = new MemoryCacheImageOutputStream(baos)) { // ImageIO output
            writer.setOutput(ios); // connect writer to stream
            ImageWriteParam p = writer.getDefaultWriteParam(); // default params
            if (p.canWriteCompressed()) { // if compression supported
                p.setCompressionMode(ImageWriteParam.MODE_EXPLICIT); // enable control
                p.setCompressionQuality(Math.max(0.1f, Math.min(1.0f, quality))); // clamp 0.1..1.0
            }
            writer.write(null, new IIOImage(img, null, null), p); // write JPEG
        } finally {
            writer.dispose(); // free writer
        }
        return baos.toByteArray(); // return bytes
    }
}
