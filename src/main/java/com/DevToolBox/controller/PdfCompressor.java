package com.DevToolBox.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.DevToolBox.Services.UsageLogger;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;

@RestController
@RequestMapping("/api/pdf")
public class PdfCompressor {

    @Autowired
    private UsageLogger usageLogger;

    // ======================================================
    //  MAIN API ENDPOINT (DO NOT CHANGE URL)
    // ======================================================
    @PostMapping(value = "/compress", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> compressPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("level") String level,
            HttpSession session) {

        usageLogger.log(session, "PDF Compressor");

        try {
            byte[] inputPdf = file.getBytes();
            byte[] compressedPdf = compressWithGhostscript(inputPdf, level);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition
                    .attachment()
                    .filename(safe(file.getOriginalFilename()) + "_compressed.pdf")
                    .build());

            return new ResponseEntity<>(compressedPdf, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("Compression failed: " + e.getMessage()).getBytes());
        }
    }

    // ======================================================
    //  GHOSTSCRIPT COMPRESSION METHOD (MAIN LOGIC)
    // ======================================================
    private byte[] compressWithGhostscript(byte[] inputPdf, String level) throws Exception {

        // ★ Your Ghostscript install path
        final String gsPath = "C:\\Program Files\\gs\\gs10.06.0\\bin\\gswin64c.exe";

        // Choose compression preset
        String gsQuality = switch (level.toLowerCase()) {
            case "low" -> "/screen";     // Max compression (smallest output)
            case "high" -> "/printer";   // Higher quality
            default -> "/ebook";         // Medium (balanced)
        };

        // Temp files
        File inFile = File.createTempFile("input_pdf_", ".pdf");
        File outFile = File.createTempFile("output_pdf_", ".pdf");

        try (FileOutputStream fos = new FileOutputStream(inFile)) {
            fos.write(inputPdf);
        }

        // Build command
        ProcessBuilder pb = new ProcessBuilder(
                gsPath,
                "-dNOPAUSE",
                "-dBATCH",
                "-dSAFER",
                "-sDEVICE=pdfwrite",
                "-dCompatibilityLevel=1.4",
                "-dPDFSETTINGS=" + gsQuality,
                "-sOutputFile=" + outFile.getAbsolutePath(),
                inFile.getAbsolutePath()
        );

        pb.redirectErrorStream(true);
        Process process = pb.start();

        // optional: capture log
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            while (br.readLine() != null) {}
        }

        int exit = process.waitFor();
        if (exit != 0) {
            throw new RuntimeException("Ghostscript failed (Exit code: " + exit + ")");
        }

        // Read compressed PDF
        byte[] compressed = java.nio.file.Files.readAllBytes(outFile.toPath());

        // Cleanup
        inFile.delete();
        outFile.delete();

        return compressed;
    }

    // ======================================================
    //  SANITIZE FILE NAME
    // ======================================================
    private String safe(String name) {
        if (name == null) return "document";
        int idx = name.toLowerCase().lastIndexOf(".pdf");
        return (idx > 0 ? name.substring(0, idx) : name)
                .replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
