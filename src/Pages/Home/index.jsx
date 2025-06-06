import React, { useEffect, useState } from "react";
import SliderComponets from "../../Componets/SliderComponets";
import Banner1 from "../../Assets/image/sliderHome/Banner1.jpg";
import Banner2 from "../../Assets/image/sliderHome/Banner2.jpg";
import CardProduct from "../../Componets/CardProduct";
import * as CartService from "../../Services/cartService";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { updateCart, deleteAllCart } from "../../Redux/reducers/cartUserReducer";

function Home() {
    const dispatch = useDispatch();
    const [productCart, setProductCart] = useState();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (user && user.token) {
            const user_id = jwtDecode(user.token).id;

            const CartGet = async () => {
                try {
                    const res = await CartService.cartGet(user_id);
                    setProductCart(res.cart.products);

                    dispatch(deleteAllCart())
                    res.cart.products.forEach((cartItem) => {
                        dispatch(updateCart({cartItem}))
                    });
                } catch (error) {
                    console.error("Lỗi khi lấy giỏ hàng:", error);
                }
            };

            CartGet(); 
        }
    }, [user, dispatch]);

    return (
        <div className="home">
            <SliderComponets arrSlider={[Banner1, Banner2]} />

            <div className="product-favorite">
                <h2 style={{ textAlign: "center" }}>Sản phẩm yêu thích</h2>
                <CardProduct />
            </div>
        </div>
    );
}

export default Home;
