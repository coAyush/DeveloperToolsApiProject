package com.DevToolBox.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import com.DevToolBox.Services.UsageLogger;
import jakarta.servlet.http.HttpSession;
import fr.opensagres.poi.xwpf.converter.pdf.PdfConverter;
import fr.opensagres.poi.xwpf.converter.pdf.PdfOptions;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/convert")
public class WordToPdfController {
    @Autowired
    UsageLogger usageLogger;
    @PostMapping
    public ResponseEntity<byte[]> wordToPdf(@RequestParam("file") MultipartFile doc,HttpSession session) {
         usageLogger.log(session, "Word to PDF");
        try (InputStream in = doc.getInputStream(); 
                XWPFDocument xwpf = new XWPFDocument(in); 
                ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PdfOptions options = PdfOptions.create();
            PdfConverter.getInstance().convert(xwpf, baos, options);

            byte[] pdf = baos.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.attachment()
                            .filename("converted.pdf")
                            .build()
            );
           
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Conversion failed: " + e.getMessage()).getBytes());
        }
    }
}
