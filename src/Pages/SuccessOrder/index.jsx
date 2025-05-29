import React from "react";
import "./SuccessPayment.scss";

const SuccessOrder = () => {
    return (
        <div className="success-payment">
            <div className="icon-wrapper">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="checkmark"
                    viewBox="0 0 52 52"
                >
                    <circle
                        className="checkmark__circle"
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                    />
                    <path
                        className="checkmark__check"
                        fill="none"
                        d="M14 27l7 7 16-16"
                    />
                </svg>
            </div>
            <h1>Thanh Toán Thành Công!</h1>
            <p>
                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xử lý và sẽ
                được giao trong thời gian sớm nhất.
            </p>
            <button
                className="btn-home"
                onClick={() => (window.location.href = "/")}
            >
                Quay về trang chủ
            </button>
        </div>
    );
};

export default SuccessOrder;
