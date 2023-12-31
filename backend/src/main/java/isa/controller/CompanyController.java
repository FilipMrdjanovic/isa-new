package isa.controller;

import isa.model.Company;
import isa.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    @GetMapping("/search/all")
    public ResponseEntity<?> getAll() {
        List<Company> companies = companyService.getAll();
        if (!companies.isEmpty()) {
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Companies found", "companies", companies)
            );
        } else {
            return ResponseEntity.ok(
                    Map.of("status", 404, "message", "No companies found")
            );
        }
    }

    @GetMapping("/search/filter")
    public ResponseEntity<?> filterCompanies(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating,
            @RequestParam(required = false) Double exactRating) {

        ResponseEntity<?> response = companyService.filterCompanies(searchText, minRating, maxRating, exactRating);

        if (response.getStatusCodeValue() == 200) {
            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message", "Companies filtered successfully",
                            "companies", response.getBody() // Modify this based on the actual response
                    )
            );
        } else {
            return response;
        }
    }
}