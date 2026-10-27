package com.expensetracker.repository;

import com.expensetracker.model.Transaction;
import com.expensetracker.model.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {

    Optional<Transaction> findByIdAndUserId(String id, String userId);

    List<Transaction> findByUserId(String userId);

    List<Transaction> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserIdAndTypeAndDateBetween(String userId, TransactionType type, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserIdAndCategory(String userId, String category);

    long countByUserIdAndCategory(String userId, String category);

    long countByUserId(String userId);

    List<Transaction> findTop10ByUserIdOrderByDateDescCreatedAtDesc(String userId);

    List<Transaction> findByUserIdAndCategoryAndDateBetween(String userId, String category, LocalDate startDate, LocalDate endDate);

    @Query("{ 'userId': ?0, " +
           "?#{ [1] == null ? { $expr: { $eq: [1, 1] } } : { 'type': [1] } }, " +
           "?#{ [2] == null || [2].isEmpty() ? { $expr: { $eq: [1, 1] } } : { 'category': [2] } }, " +
           "?#{ [3] == null ? { $expr: { $eq: [1, 1] } } : { 'date': { $gte: [3] } } }, " +
           "?#{ [4] == null ? { $expr: { $eq: [1, 1] } } : { 'date': { $lte: [4] } } }, " +
           "?#{ [5] == null || [5].isEmpty() ? { $expr: { $eq: [1, 1] } } : { $or: [ { 'description': { $regex: [5], $options: 'i' } }, { 'notes': { $regex: [5], $options: 'i' } } ] } } " +
           "}")
    Page<Transaction> filterTransactions(String userId, TransactionType type, String category,
                                        LocalDate startDate, LocalDate endDate, String search,
                                        Pageable pageable);
}
