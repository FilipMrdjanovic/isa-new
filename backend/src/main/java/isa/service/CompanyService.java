package isa.service;

import isa.model.Company;
import isa.payload.response.CompanyFilterResponse;
import isa.repository.CompanyRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;

    public ResponseEntity<?> filterCompanies(
            String searchText, Double minRating, Double maxRating, Double exactRating) {

        // Validate input parameters and return appropriate message if none provided
        if (StringUtils.isEmpty(searchText) && minRating == null
                && maxRating == null && exactRating == null) {
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", "Please provide at least one filter parameter"));
        }

        // Call the appropriate method based on the provided parameters
        List<Company> companies;
        if (exactRating != null) {
            companies = companyRepository.findByFiltersTextAndExactRating(searchText, exactRating);
        } else {
            companies = companyRepository.findByFilters(searchText, minRating, maxRating);
        }


        List<CompanyFilterResponse> companies_response = new ArrayList<>();
        if (companies.isEmpty()) {
            return ResponseEntity.ok(
                    Map.of("status", 404, "message", "No companies found")
            );
        } else {
            for (Company company : companies) {
                CompanyFilterResponse centerResponse = new CompanyFilterResponse(
                        company.getId(),
                        company.getName(),
                        company.getAddress(),
                        company.getCity(),
                        company.getAverageRating()
                );
                companies_response.add(centerResponse);
            }
            return ResponseEntity.ok(companies_response);
        }
    }

    public List<Company> getAll() {
        List<Company> companies = companyRepository.findAll();
        return companies;
    }
}
