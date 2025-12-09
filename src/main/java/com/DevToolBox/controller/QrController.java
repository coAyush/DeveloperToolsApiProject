package com.DevToolBox.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.DevToolBox.dao.UsagesDAO;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/qr")
public class QrController {

    private final Cloudinary cloudinary;
    private final UsagesDAO usage;

    public QrController(Cloudinary cloudinary, UsagesDAO usage) {
        this.cloudinary = cloudinary;
        this.usage = usage;
    }

    /**
     * POST /api/qr Accepts text + optional file, uploads file to Cloudinary,
     * generates QR (Base64), and returns JSON.
     */
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> makeQr(
            @RequestParam(name = "text", required = false) String text,
            @RequestParam(name = "file", required = false) MultipartFile file, HttpSession session
    ) {
        String fileUrl = null;
        System.out.println("SESSION USERNAME: " + session.getAttribute("Name"));

        // 1. Upload file to Cloudinary if provided
        if (file != null && !file.isEmpty()) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> result = (Map<String, Object>) cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "resource_type", "auto",
                                "folder", "uploads"
                        )
                );
                fileUrl = (String) result.get("secure_url"); // ✅ Public URL
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of(
                        "error", "Cloudinary upload failed: " + e.getMessage()
                ));
            }
        }

        // 2. Build QR content (text + file URL)
        String content = StringUtils.hasText(text) ? text.trim() : null;
        String toEncode = (fileUrl != null)
                ? (content != null ? content + "\n" + fileUrl : fileUrl)
                : content;

        if (!StringUtils.hasText(toEncode)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Provide at least 'text' or 'file'"
            ));
        }

        // 3. Generate QR PNG bytes
        byte[] png = generateQrPng(toEncode, 512);

        // 4. Convert to Base64 data URL
        String dataUrl = "data:image/png;base64," + Base64.getEncoder().encodeToString(png);

        // 5. Build response JSON
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("message", "QR generated");
        out.put("qrImageBase64", dataUrl);
        out.put("encoded", toEncode);
        if (fileUrl != null) {
            out.put("fileUrl", fileUrl);
        }
        String userName = (String) session.getAttribute("Name");
        if (userName != null) {
            usage.saveUsage(userName, "QR Code Generator");
        }

        return ResponseEntity.ok(out);
    }

    // ========== helpers ==========
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
