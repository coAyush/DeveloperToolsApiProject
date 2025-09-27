package com.DevToolBox.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class QrController {

    // Where uploads are stored (change to a stable folder for prod)
    private static final Path UPLOAD_ROOT =
            Path.of(System.getProperty("java.io.tmpdir"), "devtoolbox-uploads").toAbsolutePath();

    public QrController() {
        try { Files.createDirectories(UPLOAD_ROOT); } catch (IOException ignored) {}
    }

    /** POST /api/qr -> returns JSON with base64 QR (encodes text and/or file URL) */
    @PostMapping(
        path = "/qr",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String,Object>> makeQr(
            @RequestParam(name = "text", required = false) String text,
            @RequestParam(name = "file", required = false) MultipartFile file,
            HttpServletRequest req
    ) {
        if ((text == null || text.isBlank()) && (file == null || file.isEmpty())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Send 'text' and/or 'file'"));
        }

        // Save file and build a public download URL, if a file was sent
        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            String original = Optional.ofNullable(file.getOriginalFilename()).orElse("upload");
            String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
            String storedName = UUID.randomUUID().toString().replace("-", "") + ext;
            Path target = UPLOAD_ROOT.resolve(storedName);

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                return ResponseEntity.status(500).body(Map.of("error", "Failed to store file"));
            }
            fileUrl = baseUrl(req) + "/api/files/" + storedName;
        }

        // Build the QR content
        String content = (StringUtils.hasText(text) ? text.trim() : null);
        String toEncode = (fileUrl != null)
                ? (content != null ? content + "\n" + fileUrl : fileUrl)
                : content;

        byte[] png = generateQrPng(toEncode, 512);
        String dataUrl = "data:image/png;base64," + Base64.getEncoder().encodeToString(png);

        Map<String,Object> out = new LinkedHashMap<>();
        out.put("message", "QR generated");
        out.put("qrImageBase64", dataUrl);
        out.put("encoded", toEncode);
        if (fileUrl != null) out.put("fileDownloadUrl", fileUrl);
        return ResponseEntity.ok(out);
    }

    /** GET /api/qr/png?text=Hello -> raw QR PNG (quick test) */
    @GetMapping(path = "/qr/png", produces = MediaType.IMAGE_PNG_VALUE)
    public void png(@RequestParam(name = "text") String text, HttpServletResponse resp) {
        try {
            byte[] png = generateQrPng(text, 512);
            resp.setContentType(MediaType.IMAGE_PNG_VALUE);
            resp.getOutputStream().write(png);
        } catch (Exception e) {
            resp.setStatus(500);
        }
    }

    /** GET /api/files/{storedName} -> streams an uploaded file back */
    @GetMapping("/files/{storedName}")
    public ResponseEntity<byte[]> download(@PathVariable(name = "storedName") String storedName) {
        try {
            Path file = UPLOAD_ROOT.resolve(storedName).normalize();
            if (!file.startsWith(UPLOAD_ROOT) || !Files.exists(file)) {
                return ResponseEntity.notFound().build();
            }
            byte[] bytes = Files.readAllBytes(file);
            String ct = Files.probeContentType(file);
            String filename = URLEncoder.encode(storedName, StandardCharsets.UTF_8);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename*=UTF-8''" + filename)
                    .contentType(ct != null ? MediaType.parseMediaType(ct) : MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(bytes.length)
                    .body(bytes);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
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

    private static String baseUrl(HttpServletRequest req) {
        String scheme = req.getScheme();       // http
        String host = req.getServerName();     // localhost
        int port = req.getServerPort();        // 8080
        String ctx = Optional.ofNullable(req.getContextPath()).orElse(""); // /DeveloperToolsApiProject
        String hostPort = (port == 80 || port == 443) ? host : host + ":" + port;
        return scheme + "://" + hostPort + ctx;
    }
}
