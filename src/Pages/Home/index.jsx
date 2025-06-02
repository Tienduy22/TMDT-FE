import React from 'react';
import SliderComponets from '../../Componets/SliderComponets';
import Banner1 from '../../Assets/image/sliderHome/Banner1.jpg';
import Banner2 from '../../Assets/image/sliderHome/Banner2.jpg';
import CardProduct from '../../Componets/CardProduct';
import './style.css';

function Home(){    
    return (
        <div className="home">
            <div className="banner-container">
                <SliderComponets arrSlider={[Banner1, Banner2]} />
            </div>
            
            <div className="product-favorite">
                <h2 style={{textAlign: "center"}}>Sản phẩm yêu thích</h2>
                <CardProduct />
            </div>
        </div>
    );
}

export default Home;