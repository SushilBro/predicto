;; constants
;;
(define-constant contract-owner tx-sender)
(define-constant NOT-SUFFICIENT-AMOUNT u30)
(define-constant UNSIGNED-ONE-16 (pow u10 u16)) ;; 16 decimal places
(define-constant PLAYER-INVALID u100)
(define-constant NO-VALUE-ON-MAP u102)
;; data maps and vars
;;
(define-data-var total-amount uint u0)
(define-data-var total-down-prediction uint u0)
(define-data-var total-up-prediction uint u0)
(define-map predictors principal { up-down: bool, amount: uint })
(define-data-var block uint u0)

(define-map calculation-data uint { total-amount: uint, total-down-prediction: uint, total-up-prediction: uint })

;; (define-private (check-map)
;; (begin  
;;   (if (is-none (map-get? calculation-data block-height))
;;   (map-insert calculation-data block-height {total-amount: u0, total-down-prediction: u0, total-up-prediction: u0})
;;   false)
;;   (ok true)
;;   )
;;   )

(define-private (check-map)
(match (map-get? calculation-data block-height)
  map-value 
  true
 (map-insert calculation-data block-height {total-amount: u0, total-down-prediction: u0, total-up-prediction: u0}))
  )


(define-data-var amount-with-dust uint u0)
(define-data-var collect-dust uint u0)
(define-data-var result bool true)


;; private functions
;;

(define-public (deduct-fee) 
(ok (scale-down (* (/ (scale-up u5) u100) (unwrap-panic (get total-amount (map-get? calculation-data block-height)))))))


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

(define-read-only (check) 
(ok (map-get? calculation-data block-height))
) 

;; public functions
;;
;; #[allow(unchecked_data)]
(define-public (play-game (player principal) (amount uint) (predict-condition bool)) 
(begin     
    (asserts! (is-eq tx-sender player) (err u10))
    (asserts! (>= (stx-get-balance player) amount) (err NOT-SUFFICIENT-AMOUNT))
    (asserts! (check-map) (err NO-VALUE-ON-MAP))
    (check-map)
    (try! (transfer-stx-to-escrow amount))
    (map-insert predictors player {up-down: predict-condition, amount: amount})
    (let ((get-tuple (unwrap-panic (map-get? calculation-data block-height)))
        (total-prediction (get total-amount get-tuple))
        (total-increase-prediction (get total-up-prediction get-tuple))
        (total-decrease-prediction (get total-down-prediction get-tuple))   
    ) 
    (if (is-eq predict-condition true) 
    (begin
        (map-set calculation-data block-height
         {total-amount: ( + total-prediction amount), total-down-prediction: total-decrease-prediction, total-up-prediction: (+ total-increase-prediction amount)}
         )
     )
     (begin 
        (map-set calculation-data block-height
         {total-amount: ( + total-prediction amount), total-down-prediction: (+ total-decrease-prediction amount), total-up-prediction: total-increase-prediction}
         )
      )
    )
    (ok true))
)
)
     
(define-public (claim-amount (status bool)) 
    (let ((predicted-bool (unwrap! (get up-down (map-get? predictors tx-sender)) (err PLAYER-INVALID)))
        (predicted-amount (unwrap! (get amount (map-get? predictors tx-sender)) (err PLAYER-INVALID)))
        (get-tuple (unwrap-panic (map-get? calculation-data block-height)))
        (total-prediction (get total-amount get-tuple))
        (total-increase-prediction (get total-up-prediction get-tuple))
        (total-decrease-prediction (get total-down-prediction get-tuple))
        )
        (asserts! (and (> total-increase-prediction u0) (> total-decrease-prediction u0)) (err u3))
        (if (is-eq status predicted-bool) 
            (if (is-eq status true) 
                (let ((win (scale-down (* (/ (scale-up predicted-amount) total-increase-prediction) (- total-decrease-prediction (unwrap-panic (deduct-fee)))))))
                    (try! (transfer-stx-from-escrow (+ win predicted-amount)))
                    (map-delete predictors tx-sender)
                    (ok (+ win predicted-amount))
                 )
                 (let ((win (scale-down (* (/ (scale-up predicted-amount) total-decrease-prediction) (- total-increase-prediction (unwrap-panic (deduct-fee))))))) 
                    (try! (transfer-stx-from-escrow (+ win predicted-amount)))
                    (map-delete predictors tx-sender)
                    (ok (+ win predicted-amount))
                 )
            )
            (ok u0)
        )
    )
)
