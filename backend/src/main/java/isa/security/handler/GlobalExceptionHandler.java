package isa.security.handler;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import io.jsonwebtoken.ExpiredJwtException;

import org.springframework.security.access.AccessDeniedException;

import java.util.Map;
import java.io.IOException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ExpiredJwtException.class)
    public void handleExpiredJwtException(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(
                "{\"status\":" + HttpServletResponse.SC_FORBIDDEN + ", \"message\":\"Token expired, please re-authenticate\"}"
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public void handleAccessDeniedException(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(
                "{\"status\":" + HttpServletResponse.SC_FORBIDDEN + ", \"message\":\"Insufficient permissions for this action\"}"
        );
    }

    @ExceptionHandler(Exception.class)
    public void handleGenericException(HttpServletResponse response, Exception e) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.setContentType("application/json");
        response.getWriter().write(
                "{\"status\":" + HttpServletResponse.SC_INTERNAL_SERVER_ERROR + ", \"message\":\"" + e.getMessage() + "\"}"
        );
    }
}
