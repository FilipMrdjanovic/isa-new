package isa.controller;

import isa.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("/search/all")
    public ResponseEntity<?> getAll(){
        return companyService.getAll();
    }
    @GetMapping("/search/filter")
    public ResponseEntity<?> filterCompanies(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating,
            @RequestParam(required = false) Double exactRating) {

        return companyService.filterCompanies(searchText, minRating, maxRating, exactRating);
    }
}
