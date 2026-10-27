package com.expensetracker.service;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.dto.TransactionResponse;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Category;
import com.expensetracker.model.Transaction;
import com.expensetracker.model.TransactionType;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetService budgetService;

    public TransactionService(TransactionRepository transactionRepository,
                              CategoryRepository categoryRepository,
                              BudgetService budgetService) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.budgetService = budgetService;
    }

    public TransactionResponse createTransaction(String userId, TransactionRequest request) {
        validateTransactionRequest(userId, request);

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory().trim());
        transaction.setDate(request.getDate());
        transaction.setDescription(request.getDescription().trim());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());

        Transaction saved = transactionRepository.save(transaction);

        // Check budget thresholds if this is an expense
        if (saved.getType() == TransactionType.EXPENSE) {
            budgetService.checkBudgetAlertsForTransaction(userId, saved.getCategory(), saved.getDate());
        }

        return new TransactionResponse(saved);
    }

    public TransactionResponse getTransactionById(String id, String userId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return new TransactionResponse(transaction);
    }

    public TransactionResponse updateTransaction(String id, String userId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        validateTransactionRequest(userId, request);

        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory().trim());
        transaction.setDate(request.getDate());
        transaction.setDescription(request.getDescription().trim());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
        transaction.setUpdatedAt(LocalDateTime.now());

        Transaction updated = transactionRepository.save(transaction);

        if (updated.getType() == TransactionType.EXPENSE) {
            budgetService.checkBudgetAlertsForTransaction(userId, updated.getCategory(), updated.getDate());
        }

        return new TransactionResponse(updated);
    }

    public void deleteTransaction(String id, String userId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        transactionRepository.delete(transaction);
    }

    public Page<TransactionResponse> getTransactions(String userId, TransactionType type, String category,
                                                     LocalDate startDate, LocalDate endDate, String search,
                                                     int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by(
                "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC,
                (sortBy != null && !sortBy.isBlank()) ? sortBy : "date"
        );
        Pageable pageable = PageRequest.of(page >= 0 ? page : 0, size > 0 ? size : 20, sort);

        Page<Transaction> transactionPage = transactionRepository.filterTransactions(
                userId, type, (category != null && !category.isBlank()) ? category.trim() : null,
                startDate, endDate, (search != null && !search.isBlank()) ? search.trim() : null,
                pageable
        );

        return transactionPage.map(TransactionResponse::new);
    }

    public List<TransactionResponse> getRecentTransactions(String userId) {
        return transactionRepository.findTop10ByUserIdOrderByDateDescCreatedAtDesc(userId)
                .stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }

    private void validateTransactionRequest(String userId, TransactionRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be strictly greater than zero");
        }

        if (request.getDate() == null) {
            throw new BadRequestException("Transaction date is required");
        }

        String categoryName = request.getCategory() != null ? request.getCategory().trim() : "";
        if (categoryName.isEmpty()) {
            throw new BadRequestException("Category is required");
        }

        boolean exists = categoryRepository.existsByNameIgnoreCaseAndUserId(categoryName, userId)
                || categoryRepository.existsByNameIgnoreCaseAndIsSystemTrue(categoryName);
        if (!exists) {
            throw new BadRequestException("Category '" + categoryName + "' does not exist");
        }
    }
}
