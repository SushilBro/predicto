
;; predicto
;; <add a description here>

;; constants
;;
(define-constant adminAddress tx-sender)
(define-constant contract-owner tx-sender)
(define-constant NOT-SUFFICIENT-AMOUNT u10)
;; data maps and vars
;;
(define-data-var bitcoin-value uint u0)
(define-data-var counter uint u0)
(define-map predictors principal { up-down: bool, amount: uint })



;; private functions
;;

;; public functions
;;
(define-public (check-play (player principal) (amount uint) (predict-condition bool)) 
(begin     
    (asserts! (is-eq tx-sender player) (err u10))
    (asserts! (>= amount (stx-get-balance player)) (err NOT-SUFFICIENT-AMOUNT))
    (map-insert predictors player {up-down: predict-condition, amount: amount})
    (var-set counter (+ (var-get counter) amount))
    (ok true))
)

(define-private (deduct-fee) 
(ok (* (/ u5 u100) (var-get counter))))

(define-read-only (get-count) 
    (var-get counter)
)

(define-public (count-up) 
    (begin 
    (asserts! (is-eq tx-sender contract-owner) (err false))
    (ok (var-set counter (+ (get-count) u1)))
    )
)
(define-public (check-call (token uint)) 
(begin 
(print token)
 (ok true))
)


