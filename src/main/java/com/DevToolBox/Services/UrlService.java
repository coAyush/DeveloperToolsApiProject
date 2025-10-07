package com.DevToolBox.Services;

import com.DevToolBox.dao.UrlDao;
import com.DevToolBox.Model.Url;
import com.DevToolBox.util.ShortCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UrlService {

    @Autowired
    private UrlDao urlDao;

    public String shortenUrl(String originalUrl, String alias) {
        String code;

        if (alias != null && !alias.trim().isEmpty()) {
            // Check if alias already exists in DB
            if (urlDao.findByCode(alias) != null) {
                throw new IllegalArgumentException("Alias already in use. Please choose another one.");
            }
            code = alias.trim();
        } else {
            // Generate unique random code
            do {
                code = ShortCodeGenerator.generateCode(6);
            } while (urlDao.findByCode(code) != null);
        }

        Url url = new Url();
        url.setOriginalUrl(originalUrl);
        url.setShortCode(code);
        urlDao.saveUrl(url);

        return code;
    }

    public String getOriginalUrl(String code) {
        Url url = urlDao.findByCode(code);
        return (url != null) ? url.getOriginalUrl() : null;
    }
}
