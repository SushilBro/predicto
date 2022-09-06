
;; predicto
;; <add a description here>

;; constants
;;
(define-constant contract-owner tx-sender)
(define-constant NOT-SUFFICIENT-AMOUNT u30)
(define-constant UNSIGNED-ONE-16 (pow u10 u16)) ;; 16 decimal places
;; data maps and vars
;;
(define-data-var total-amount uint u0)
(define-data-var total-down-prediction uint u0)
(define-data-var total-up-prediction uint u0)
(define-map predictors principal { up-down: bool, amount: uint })



;; private functions
;;

(define-private (deduct-fee) 
(ok (scale-down (* (/ (scale-up u5) u100) (var-get total-amount)))))

;; UTILITIES
;; CREDIT: math functions taken from Alex math-fixed-point-16.clar

(define-private (scale-up (a uint))
  (* a UNSIGNED-ONE-16)
)

(define-private (scale-down (a uint))
  (/ a UNSIGNED-ONE-16)
)

;; public functions
;;
(define-public (check-play (player principal) (amount uint) (predict-condition bool)) 
(begin     
    (asserts! (is-eq tx-sender player) (err u10))
    (asserts! (>= (stx-get-balance player) amount) (err NOT-SUFFICIENT-AMOUNT))
    (map-insert predictors player {up-down: predict-condition, amount: amount})
    (if (is-eq predict-condition true) 
        (var-set total-up-prediction (+ (var-get total-up-prediction) amount))
        (var-set total-down-prediction (+ (var-get total-down-prediction) amount))
    )
    (var-set total-amount (+ (var-get total-amount) amount))
    (ok true))
)


(define-read-only (get-count) 
    (var-get total-amount)
)

(define-read-only (map-data (predictor principal))
    (map-get? predictors predictor)
)

(define-public (prediction-result (status bool)) 
    (let ((predicted-bool (unwrap-panic (get up-down (map-get? predictors tx-sender))))
        (predicted-amount (unwrap-panic (get amount (map-get? predictors tx-sender)))))
        (if (is-eq status predicted-bool) 
            (if (is-eq status true) 
                (ok (scale-down (* (/ (scale-up predicted-amount) (var-get total-up-prediction)) (- (var-get total-down-prediction) (unwrap-panic (deduct-fee))))))
                (ok (scale-down (* (/ (scale-up predicted-amount) (var-get total-down-prediction)) (- (var-get total-up-prediction) (unwrap-panic (deduct-fee))))))
            )
            (ok u200)
        )
    )
)
