/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.DevToolBox.Services;

import java.io.InputStream;
import java.io.OutputStream;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.springframework.stereotype.Service;

/**
 *
 * @author USER
 */
@Service
public class DocToPdfService {
    public void convert(InputStream input,OutputStream output)throws Exception{
        WordprocessingMLPackage word=WordprocessingMLPackage.load(input);
        System.setProperty("docx4j.fonts.autoscan", "true");
        org.docx4j.Docx4J.toPDF(word, output);
    }
}
