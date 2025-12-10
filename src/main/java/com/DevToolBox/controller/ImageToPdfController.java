/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.DevToolBox.controller;

import com.DevToolBox.Services.ImageToPdf;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.DevToolBox.Services.UsageLogger;
import jakarta.servlet.http.HttpSession;

/**
 *
 * @author USER
 */
@RestController
@RequestMapping("/api/ImgToPdf")
public class ImageToPdfController {

    @Autowired
    private ImageToPdf service;
    @Autowired
    private UsageLogger usageLogger;

    @PostMapping("/single")
    public void ImageToPdfSingle(@RequestParam("file") MultipartFile file, HttpServletResponse response, HttpSession session) throws Exception {
        usageLogger.log(session, "Image to PDF");
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=image.pdf");
        service.convertSingle(file.getInputStream(), response.getOutputStream());
    }

    @PostMapping("/multiple")
    public void ImageToPdfMultiple(@RequestParam("files") MultipartFile[] files,HttpSession session, HttpServletResponse response) throws Exception {
        usageLogger.log(session, "Image to PDF");
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=images.pdf");

        List<java.io.InputStream> streams = Arrays.stream(files)
                .map(f -> {
                    try {
                        return f.getInputStream();
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();

        service.convertMany(streams, response.getOutputStream());
    }
}
