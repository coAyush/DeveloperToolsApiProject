package com.DevToolBox.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/qr")
public class QrController {

    /** POST /api/qr  -> returns JSON with base64 QR image */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> makeQr(
            @RequestParam(value = "text", required = false) String text,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        // 1) Decide what to encode
        String toEncode = null;

        if (StringUtils.hasText(text)) {
            toEncode = text.trim();
        }

        if (file != null && !file.isEmpty()) {
            // If a file is sent, we’ll just encode the file name (simple!)
            // You can later change this to a real download URL if you add a file-download endpoint.
            String filePart = "FILE: " + file.getOriginalFilename();
            toEncode = (toEncode == null) ? filePart : (toEncode + "\n" + filePart);
        }

        if (!StringUtils.hasText(toEncode)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Send 'text' and/or 'file'"));
        }

        // 2) Generate PNG bytes
        byte[] png = generateQrPng(toEncode, 512);

        // 3) Return as base64 so frontend can <img src="data:image/png;base64,...">
        String dataUrl = "data:image/png;base64," + Base64.getEncoder().encodeToString(png);

        Map<String, Object> out = new HashMap<>();
        out.put("message", "QR generated");
        out.put("qrImageBase64", dataUrl);   // <-- front-end uses this
        out.put("bytes", png.length);
        out.put("encoded", toEncode);
        return ResponseEntity.ok(out);
    }

    /** GET /api/qr/png?text=Hello -> returns raw PNG image */
    @GetMapping(path = "/png", produces = MediaType.IMAGE_PNG_VALUE)
    public void png(@RequestParam("text") String text, HttpServletResponse resp) {
        try {
            byte[] png = generateQrPng(text, 512);
            resp.setContentType(MediaType.IMAGE_PNG_VALUE);
            resp.getOutputStream().write(png);
        } catch (Exception e) {
            resp.setStatus(500);
        }
    }

    // ---- helper to create QR PNG ----
    private static byte[] generateQrPng(String content, int size) {
        try {
            var hints = new EnumMap<EncodeHintType, Object>(EncodeHintType.class);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 1);
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);

            BitMatrix matrix = new MultiFormatWriter()
                    .encode(content, BarcodeFormat.QR_CODE, size, size, hints);

            BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                ImageIO.write(image, "PNG", baos);
                return baos.toByteArray();
            }
        } catch (Exception e) {
            throw new RuntimeException("QR generation failed", e);
        }
    }
}
