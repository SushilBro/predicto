;; (use-trait predicto-trait .predicto-trait.predicto-trait)
;; constants
;;
(define-constant contract-owner tx-sender)
(define-constant NOT-SUFFICIENT-AMOUNT u30)
(define-constant UNSIGNED-ONE-16 (pow u10 u16)) ;; 16 decimal places
(define-constant PLAYER-INVALID u100)
;; data maps and vars
;;
(define-data-var total-amount uint u0)
(define-data-var total-down-prediction uint u0)
(define-data-var total-up-prediction uint u0)
(define-map predictors principal { up-down: bool, amount: uint })
(define-data-var amount-with-dust uint u0)
(define-data-var collect-dust uint u0)
(define-data-var result bool true)



;; private functions
;;

(define-private (deduct-fee) 
(ok (scale-down (* (/ (scale-up u5) u100) (var-get total-amount)))))

(define-public (deduct)
(let ((amount (* (/ (scale-up u5) u100) (var-get total-amount))))
    (var-set collect-dust (+ (var-get collect-dust) (- amount (scale-down amount))))
    (ok (scale-down amount))
)
)
;;#[allow(unchecked_data)]
(define-private (transfer (amount uint) (sender principal) (receiver principal)) 
    (stx-transfer? amount sender receiver)
)

;; UTILITIES
;; CREDIT: math functions taken from Alex math-fixed-point-16.clar
;; #[allow(unchecked_data)]
(define-private (scale-up (a uint))
  (* a UNSIGNED-ONE-16)
)
;;#[allow(unchecked_data)]
(define-private (scale-down (a uint))
  (/ a UNSIGNED-ONE-16)
)
;; #[allow(unchecked_data)]
(define-private (dust-collection (amount uint))
(begin 
    (var-set collect-dust (+ (var-get collect-dust) (- (var-get amount-with-dust) amount)))
    (ok true)
)
)
;;#[allow(unchecked_data)]
(define-private (transfer-stx-to-escrow (amount uint))
    (begin
        (transfer amount  tx-sender (as-contract tx-sender))
  )
)
;; ;;#[allow(unchecked_data)]
(define-private (transfer-stx-from-escrow (amount uint))
    (let ((owner tx-sender)) 
      (begin
        (as-contract (transfer amount (as-contract tx-sender) owner))
        
      ) 
    )
)

;; public functions
;;
;; #[allow(unchecked_data)]
(define-public (play-game (player principal) (amount uint) (predict-condition bool)) 
(begin     
    (asserts! (is-eq tx-sender player) (err u10))
    (asserts! (>= (stx-get-balance player) amount) (err NOT-SUFFICIENT-AMOUNT))
    (try! (transfer-stx-to-escrow amount))
    (map-insert predictors player {up-down: predict-condition, amount: amount})
    (if (is-eq predict-condition true) 
    (begin
        ;;  (try! (transfer-stx-to-escrow tradables amount))
        (var-set total-up-prediction (+ (var-get total-up-prediction) amount))
     )
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

;; #[allow(unchecked_data)]
(define-public (prediction-result (status bool))
    (ok (var-set result status))
)

(define-public (claim-amount (status bool)) 
    (let ((predicted-bool (unwrap! (get up-down (map-get? predictors tx-sender)) (err PLAYER-INVALID)))
        (predicted-amount (unwrap! (get amount (map-get? predictors tx-sender)) (err PLAYER-INVALID))))
        (if (is-eq status predicted-bool) 
            (if (is-eq status true) 
                (let ((win (scale-down (* (/ (scale-up predicted-amount) (var-get total-up-prediction)) (- (var-get total-down-prediction) (unwrap-panic (deduct-fee)))))))
                    (try! (transfer-stx-from-escrow (+ win predicted-amount)))
                    (ok (+ win predicted-amount))
                 )
                 (let ((win (scale-down (* (/ (scale-up predicted-amount) (var-get total-down-prediction)) (- (var-get total-up-prediction) (unwrap-panic (deduct-fee))))))) 
                    (try! (transfer-stx-from-escrow (+ win predicted-amount)))
                    (ok (+ win predicted-amount))
                 )
                
            )
            (ok u0)
        )
    )
)
