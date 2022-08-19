
;; predicto
;; <add a description here>

;; constants
;;
(define-constant contract-owner tx-sender)
(define-constant NOT-SUFFICIENT-AMOUNT u30)
;; data maps and vars
;;
(define-data-var total-amount uint u0)
(define-data-var total-down-prediction uint u0)
(define-data-var total-up-prediction uint u0)
(define-map predictors principal { up-down: bool, amount: uint })



;; private functions
;;

;; public functions
;;
(define-public (check-play (player principal) (amount uint) (predict-condition bool)) 
(begin     
    (asserts! (is-eq tx-sender player) (err u10))
    (asserts! (>= (stx-get-balance player) amount) (err NOT-SUFFICIENT-AMOUNT))
    (map-insert predictors player {up-down: predict-condition, amount: amount})
    (if (is-eq predict-condition true) 
        (var-set total-up-prediction (+ (var-get total-up-prediction) amount))
        (var-set total-up-prediction (+ (var-get total-down-prediction) amount))
    )
    (var-set total-amount (+ (var-get total-amount) amount))

    (ok true))
)

(define-private (deduct-fee) 
(ok (* (/ u5 u100) (var-get total-amount))))

(define-read-only (get-count) 
    (var-get total-amount)
)

(define-read-only (map-data (predictor principal))
    (map-get? predictors predictor)
)

;; (define-public (count-up) 
;;     (begin 
;;     (asserts! (is-eq tx-sender contract-owner) (err false))
;;     (ok (var-set total-amount (+ (get-count) u1)))
;;     )
;; )

(define-public (prediction-result (status bool) (changed-value uint)) 
    (let ((predicted-bool (unwrap-panic (get up-down (map-get? predictors tx-sender))))
        (predicted-amount (unwrap-panic (get amount (map-get? predictors tx-sender)))))
        (if (is-eq status predicted-bool) 
            (ok (- (* (/ predicted-amount (var-get total-up-prediction)) (var-get total-down-prediction)) (unwrap-panic (deduct-fee))))
            
            (ok u20)
        )
    )
)

(define-public (check-call (token uint)) 
(begin 
(print token)
 (ok true))
)


