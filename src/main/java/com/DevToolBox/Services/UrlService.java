package com.DevToolBox.Services;

import com.DevToolBox.dao.UrlDao; // or repository
import com.DevToolBox.Model.Url;
import com.DevToolBox.util.ShortCodeGenerator;
import org.springframework.stereotype.Service;

@Service
public class UrlService {

    private final UrlDao urlDao;

    public UrlService(UrlDao urlDao) {
        this.urlDao = urlDao;
    }

    public String shortenUrl(String originalUrl, String alias) {
        String code;

        if (alias != null && !alias.trim().isEmpty()) {
            String trimmed = alias.trim();
            if (urlDao.findByCode(trimmed) != null) {
                throw new IllegalArgumentException("Alias already in use. Please choose another one.");
            }
            code = trimmed;
        } else {
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
