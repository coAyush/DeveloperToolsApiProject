package com.DevToolBox.controller;

import com.DevToolBox.Services.DocToPdfService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/convert")
public class WordToPdfController {

    @Autowired
    private DocToPdfService service;

    @PostMapping("/docx-to-pdf")
    public void convertDocxToPdf(@RequestParam("file") MultipartFile file,
                                 HttpServletResponse response) throws Exception {

        // 1) basic validation
        String name = (file.getOriginalFilename() == null) ? "document.docx" : file.getOriginalFilename();
        String lower = name.toLowerCase();
        if (!lower.endsWith(".docx")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Please upload a .docx file");
            return;
        }

        // 2) set response headers
        String pdfName = sanitizeBaseName(name) + ".pdf";
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + pdfName + "\"");

        // 3) do the conversion (streams are managed by container; service does not close them)
        service.convert(file.getInputStream(), response.getOutputStream());
    }

    /** Remove path separators and extension for a safe download filename. */
    private String sanitizeBaseName(String filename) {
        String base = filename.replace("\\", "/");
        int slash = base.lastIndexOf('/');
        if (slash >= 0) base = base.substring(slash + 1);
        int dot = base.lastIndexOf('.');
        if (dot > 0) base = base.substring(0, dot);
        // tiny cleanup for header safety
        return base.replaceAll("[\\r\\n\"]", "_");
    }
}
