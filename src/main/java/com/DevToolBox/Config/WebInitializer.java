package com.DevToolBox.Config;

import jakarta.servlet.MultipartConfigElement;
import jakarta.servlet.ServletRegistration;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class WebInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[]{AppConfig.class};
    }

   

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[]{WebConfig.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    // IMPORTANT for file upload with Spring 6 / Servlet 6
    @Override
    protected void customizeRegistration(ServletRegistration.Dynamic registration) {
        String tmpDir = System.getProperty("java.io.tmpdir");   // where parts are buffered
        long maxFileSize = 20L * 1024 * 1024;  // 20 MB per file
        long maxRequestSize = 40L * 1024 * 1024;  // 40 MB per request
        int threshold = 0;                  // write directly to disk

        registration.setMultipartConfig(
                new MultipartConfigElement(tmpDir, maxFileSize, maxRequestSize, threshold)
        );
    }
}
