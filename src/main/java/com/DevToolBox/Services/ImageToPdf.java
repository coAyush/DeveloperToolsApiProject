package com.DevToolBox.Services;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.JPEGFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import com.DevToolBox.dao.UsagesDAO;

@Service
public class ImageToPdf {

    private final UsagesDAO usage;

    public ImageToPdf(UsagesDAO usage) {
        this.usage = usage;
    }

    /**
     * Convert one image to a single-page PDF.
     */
    public void convertSingle(InputStream imageInput, OutputStream pdfOutput) throws Exception {
        convertMany(List.of(imageInput), pdfOutput);
    }

    /**
     * Convert multiple images to a multi-page PDF. One image per page,
     * auto-rotate page, auto-scale to fit.
     */
    public void convertMany(List<InputStream> imageInputs, OutputStream pdfOutput) throws Exception {
        try (PDDocument doc = new PDDocument()) {
            for (InputStream in : imageInputs) {
                BufferedImage img = ImageIO.read(in);
                if (img == null) {
                    throw new IllegalArgumentException("Unsupported image format or corrupt image.");
                }

                // Decide page orientation based on image aspect ratio
                boolean landscape = img.getWidth() >= img.getHeight();
                PDRectangle base = PDRectangle.A4; // you can change to LETTER if needed
                PDRectangle pageSize = landscape
                        ? new PDRectangle(base.getHeight(), base.getWidth())
                        : base;

                PDPage page = new PDPage(pageSize);
                doc.addPage(page);

                // Create PDImageXObject (JPEG for jpg, Lossless for png/others)
                PDImageXObject pdImage = createImageXObject(doc, img);

                // Compute target rectangle with margins, preserving aspect
                float margin = 36f; // 0.5 inch margin
                float maxW = pageSize.getWidth() - 2 * margin;
                float maxH = pageSize.getHeight() - 2 * margin;

                float imgW = pdImage.getWidth();
                float imgH = pdImage.getHeight();

                // scale to fit
                float scale = Math.min(maxW / imgW, maxH / imgH);
                float drawW = imgW * scale;
                float drawH = imgH * scale;

                // center on page
                float x = (pageSize.getWidth() - drawW) / 2f;
                float y = (pageSize.getHeight() - drawH) / 2f;

                try (PDPageContentStream cs = new PDPageContentStream(doc, page, PDPageContentStream.AppendMode.OVERWRITE, false)) {
                    cs.drawImage(pdImage, x, y, drawW, drawH);
                }
            }

            // Save the document to the provided OutputStream
            doc.save(pdfOutput);

            try {
                usage.saveUsage("Ayush", "Image To Pdf Converter");
            } catch (Exception e) {
                System.out.println("failed to catch log");
            }
        }
    }

    /**
     * Create a PDImageXObject best-suited for the source image. - If original
     * had no alpha and looks like a JPEG source, JPEGFactory is efficient. - If
     * image has alpha/transparency (e.g., PNG with alpha), use LosslessFactory.
     */
    private PDImageXObject createImageXObject(PDDocument doc, BufferedImage img) throws Exception {
        // Heuristic: if the image has alpha channel, use lossless to preserve it.
        boolean hasAlpha = img.getColorModel().hasAlpha();
        if (hasAlpha) {
            return LosslessFactory.createFromImage(doc, img);
        }
        // Otherwise JPEG is typically smaller for photos
        return JPEGFactory.createFromImage(doc, img, 0.85f); // quality 0..1
    }
}
