package com.DevToolBox.controller;

import com.DevToolBox.Services.DocToPdfService;
import org.apache.tika.Tika;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/convert")
public class WordToPdfController {

    private final DocToPdfService service;
    private final Tika tika = new Tika();

    public WordToPdfController(DocToPdfService service) {
        this.service = service;
    }

    @PostMapping(
            path = "/docx-to-pdf",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<?> convertDocxToPdf(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file provided.");
            }

            String original = file.getOriginalFilename();
            String safeName = (original == null || original.isBlank()) ? "document.docx" : original;
            if (!safeName.toLowerCase().endsWith(".docx")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload a .docx file.");
            }

            // Tika detect (uses a fresh stream)
            String detected = tika.detect(file.getInputStream());
            if (!"application/vnd.openxmlformats-officedocument.wordprocessingml.document".equalsIgnoreCase(detected)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is not a valid .docx.");
            }

            // Convert to temp file to know Content-Length and avoid big memory buffers
            File tmpPdf = File.createTempFile("docx2pdf-", ".pdf");
            try (InputStream in = file.getInputStream(); OutputStream out = new BufferedOutputStream(new FileOutputStream(tmpPdf))) {
                service.convert(in, out);
            }

            String base = sanitizeBaseName(safeName);
            String downloadName = base + ".pdf";
            String encoded = URLEncoder.encode(downloadName, StandardCharsets.UTF_8)
                    .replaceAll("\\+", "%20");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(tmpPdf.length());
            headers.set("X-Content-Type-Options", "nosniff");
            headers.setCacheControl(CacheControl.noCache().getHeaderValue());
            headers.set(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + asciiFallback(downloadName) + "\"; filename*=UTF-8''" + encoded);

            // Stream file then delete it
            StreamingResponseBody body = outputStream -> {
                try (InputStream fis = new BufferedInputStream(new FileInputStream(tmpPdf))) {
                    fis.transferTo(outputStream);
                    outputStream.flush();
                } finally {
                    // Best-effort cleanup
                    if (!tmpPdf.delete()) {
                        tmpPdf.deleteOnExit();
                    }
                }
            };

            return new ResponseEntity<>(body, headers, HttpStatus.OK);

        } catch (Exception ex) {
            // log error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Conversion failed.");
        }
    }

    private String sanitizeBaseName(String filename) {
        String base = filename.replace("\\", "/");
        int slash = base.lastIndexOf('/');
        if (slash >= 0) {
            base = base.substring(slash + 1);
        }
        int dot = base.lastIndexOf('.');
        if (dot > 0) {
            base = base.substring(0, dot);
        }
        base = base.replaceAll("[\\r\\n\"%`;:<>|*?]", "_");
        base = base.replaceAll("\\s+", " ").trim();
        if (base.isBlank()) {
            base = "document";
        }
        return base;
    }

    private String asciiFallback(String name) {
        String ascii = name.replaceAll("[^\\x20-\\x7E]", "_");
        return ascii.isBlank() ? "document.pdf" : ascii;
    }
}
