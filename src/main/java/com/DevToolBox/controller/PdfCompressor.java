package com.DevToolBox.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.pdf.xobject.PdfImageXObject;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.xobject.PdfFormXObject;
import com.itextpdf.kernel.pdf.PdfName;
import com.itextpdf.kernel.pdf.PdfNumber;
import com.DevToolBox.dao.UsagesDAO;
import jakarta.servlet.http.HttpSession;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.MemoryCacheImageOutputStream;
import javax.imageio.IIOImage;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Iterator;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/pdf")
public class PdfCompressor{
    private final UsagesDAO usage;
    public PdfCompressor(UsagesDAO usage){
        this.usage=usage;
    }
  @PostMapping(value="/compress", produces=MediaType.APPLICATION_PDF_VALUE)
  public ResponseEntity<byte[]> compress(@RequestParam("file") MultipartFile file,
                                         @RequestParam(value="level", defaultValue="medium") String level,HttpSession session) {
    try {
      float scale, quality; // image downscale + JPEG quality
      switch (level.toLowerCase()) {
        case "low"    -> { scale = 0.5f; quality = 0.5f; }
        case "high"   -> { scale = 0.85f; quality = 0.8f; }
        default       -> { scale = 0.65f; quality = 0.65f; }
      }

      byte[] out = compressWithIText(file.getBytes(), scale, quality);

      HttpHeaders h = new HttpHeaders();
      h.setContentType(MediaType.APPLICATION_PDF);
      h.setContentDisposition(ContentDisposition.attachment()
        .filename(safe(file.getOriginalFilename()) + "_compressed.pdf").build());
        usage.saveUsage((String)session.getAttribute("Name"), "Pdf Compressor");
      return new ResponseEntity<>(out, h, HttpStatus.OK);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(500)
          .contentType(MediaType.TEXT_PLAIN)
          .body(("Compression failed: " + e.getMessage()).getBytes());
    }
  }

  private String safe(String name) {
    if (name == null) return "document";
    int i = name.toLowerCase().lastIndexOf(".pdf");
    return (i > 0 ? name.substring(0, i) : name).replaceAll("[^a-zA-Z0-9._-]", "_");
  }

 private byte[] compressWithIText(byte[] input, float scale, float jpegQuality) throws IOException {
    try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

        PdfReader reader = new PdfReader(new ByteArrayInputStream(input));
        WriterProperties wp = new WriterProperties()
                .setFullCompressionMode(true)                       // xref/object streams
                .setCompressionLevel(PdfWriterCompressionLevel.BEST_COMPRESSION); // 0..9

        PdfWriter writer = new PdfWriter(baos, wp);
        PdfDocument pdf = new PdfDocument(reader, writer);

        int pageCount = pdf.getNumberOfPages();
        for (int i = 1; i <= pageCount; i++) {
            PdfPage page = pdf.getPage(i);
            compressXObjects(page.getResources(), pdf, scale, jpegQuality);
        }

        pdf.close();
        return baos.toByteArray();
    }
}


  private void compressXObjects(PdfResources resources, PdfDocument pdf, float scale, float jpegQuality) throws IOException {
    if (resources == null) return;

    PdfDictionary xobjs = resources.getResource(PdfName.XObject);
    if (xobjs == null) return;

    for (Map.Entry<PdfName, PdfObject> e : xobjs.entrySet()) {
      PdfObject obj = e.getValue();
      if (obj == null || !obj.isStream()) continue;

      PdfStream stream = (PdfStream) obj;

      // Image XObject?
      PdfName subtype = stream.getAsName(PdfName.Subtype);
      if (PdfName.Image.equals(subtype)) {
        PdfImageXObject newImg = recompressImage(stream, pdf, scale, jpegQuality);
        if (newImg != null) {
          xobjs.put(e.getKey(), newImg.getPdfObject());
        }
      }
      // Form XObject? Recurse into its resources
      else if (PdfName.Form.equals(subtype)) {
        PdfFormXObject form = new PdfFormXObject(stream);
        compressXObjects(form.getResources(), pdf, scale, jpegQuality);
      }
    }
  }

  private PdfImageXObject recompressImage(PdfStream imgStream, PdfDocument pdf, float scale, float jpegQuality) throws IOException {
    byte[] bytes = imgStream.getBytes();
    BufferedImage src = ImageIO.read(new ByteArrayInputStream(bytes));
    if (src == null) return null;

    int w = Math.max(1, Math.round(src.getWidth() * scale));
    int h = Math.max(1, Math.round(src.getHeight() * scale));

    BufferedImage dst = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
    Graphics2D g = dst.createGraphics();
    g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
    g.setColor(Color.WHITE);
    g.fillRect(0, 0, w, h);
    g.drawImage(src, 0, 0, w, h, null);
    g.dispose();

    byte[] jpeg = toJpeg(dst, jpegQuality);

    ImageData id = ImageDataFactory.create(jpeg);
    PdfImageXObject x = new PdfImageXObject(id);
    // ensure proper params
    x.getPdfObject().put(PdfName.Filter, PdfName.DCTDecode);
    x.getPdfObject().put(PdfName.BitsPerComponent, new PdfNumber(8));
    x.getPdfObject().put(PdfName.ColorSpace, PdfName.DeviceRGB);
    return x;
  }

  private byte[] toJpeg(BufferedImage img, float quality) throws IOException {
    Iterator<ImageWriter> it = ImageIO.getImageWritersByFormatName("jpeg");
    if (!it.hasNext()) throw new IOException("No JPEG writer");

    ImageWriter w = it.next();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    try (MemoryCacheImageOutputStream ios = new MemoryCacheImageOutputStream(baos)) {
      w.setOutput(ios);
      ImageWriteParam p = w.getDefaultWriteParam();
      if (p.canWriteCompressed()) {
        p.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        p.setCompressionQuality(Math.max(0.1f, Math.min(1f, quality)));
      }
      w.write(null, new IIOImage(img, null, null), p);
    } finally {
      w.dispose();
    }
    return baos.toByteArray();
  }

  // iText uses ints 0..9; map a friendly constant
  private static class PdfWriterCompressionLevel {
    static final int BEST_COMPRESSION = 9;
  }
}
