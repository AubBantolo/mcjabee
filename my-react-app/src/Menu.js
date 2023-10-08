import './Menu.css';
import React, { useEffect } from 'react';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrumstickBite } from '@fortawesome/free-solid-svg-icons';
import { faBowlRice } from '@fortawesome/free-solid-svg-icons';
import { faBurger } from '@fortawesome/free-solid-svg-icons';
import { faIceCream } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faCandyCane } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
const baseURL = "http://localhost:8080";

function Menu() {

    const navigate = useNavigate();
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [placeOrderTy, setPlaceOrderTy] = React.useState(false);
    const [modalReceiptOpen, setModalReceiptOpen] = React.useState(false);
    const [cartMenuList, setCartMenuList] = React.useState([]);
    const [inventoryList, setInventoryList] = React.useState([]);

    const [addMenuList, setAddMenuList] = React.useState([{}]);

    React.useEffect(() => {
            axios.get(baseURL + "/api/findAllMenuItems")
                            .then((response) => {
                                    setAddMenuList(response.data);
                                    console.log(addMenuList);
                                  })
                                  .catch(error => {
                                  });
    }, []);

    const buildMenuList = (type) => {
        console.log(type);
        axios.get(baseURL + "/api/menuStream/" + type)
            .then((response) => {
                setAddMenuList(response.data);
            }).catch(error => {
            });
    }

    const [total, setTotal] = React.useState(0);

    const openModal = () => {
       setTotal(cartMenuList.reduce((s,{price}) => s + price, 0));
       setIsOpen(true);
    }

    const customStyles = {
      content: {
        background: 'transparent',
        opacity: '2',
        border: '0px',
      },
    };

    const addutucart = (menu) => {
              if (cartMenuList.some(item => item.id === menu.id)) {
                      setCartMenuList(cartMenuList => cartMenuList.map(item => item.id === menu.id
                        ? { ...item, price: menu.qty * menu.price, qty: menu.qty }
                        : item,
                      ));
                    } else {
                             setCartMenuList(cartMenuList.concat(menu));
                             setCartMenuList(cartMenuList => cartMenuList.map(item => item.id === menu.id
                               ? { ...item, price: menu.qty * menu.price }
                               : item,
                             ));
               }
    }

    const addToCart = (newItem) => {
      if (addMenuList.some(item => item.id === newItem.id)) {
        setAddMenuList(addMenuList => addMenuList.map(item => item.id === newItem.id
          ? { ...item, qty: parseInt(item.qty, 10) + 1 }
          : item,
        ));
      } else {
        setAddMenuList(addMenuList => [...addMenuList, newItem]);
      }
    }

    const minusToCart = (newItem) => {
      if (addMenuList.some(item => item.id === newItem.id && item.qty > 0)) {
        setAddMenuList(addMenuList => addMenuList.map(item => item.id === newItem.id
          ? { ...item, qty: parseInt(item.qty, 10) - 1 }
          : item,
        ));
      }
    }

    const checkout = () => {
                axios.put(baseURL + "/api/updateInventoryStock", cartMenuList)
                                .then((response) => {
                                        setInventoryList(response.data);
                                        setIsOpen(false);
                                        setModalReceiptOpen(true);
                                      })
                                      .catch(error => {
                                      });
    }

    const cancelRecp = () => {
        setIsOpen(true);
        setModalReceiptOpen(false);
    }

    function closeModal() {
       setIsOpen(false);
    }

     function cancelCart() {
       setIsOpen(false);
       window.location.reload();
    }

    function placeOrder() {
       setPlaceOrderTy(true);
       setModalReceiptOpen(false);
    }

    function backToHome() {
       window.location.reload();
    }

    return (
        <div>
        <table class="table">
                <input class="seeCartBtn" type="submit" value="Open cart" onClick={() => openModal()}/>
                <input class="logoutBtn" type="submit" value="Logout" onClick={() => navigate("/")} />

                <Modal class="modal"
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                >
                    <table class="menu-table">
                       <thead class="orderSummary">
                            <th colspan="5" class="orderSmry"> ORDER SUMMARY:</th>
                       </thead>
                       <tbody>
                       {cartMenuList.map(cartMenu => (
                            <tr key={cartMenu.id}>
                                <td><img src={cartMenu.image} width="500" height="600"/></td>
                                <td>{cartMenu.name}</td>
                                <td>{cartMenu.type}</td>
                                <td>{cartMenu.qty}</td>
                                <td>{cartMenu.price}</td>
                            </tr>
                       ))}
                       </tbody>
                    <thead class="orderSummary">
                            <th colspan="5" class="orderTotal">
                            TOTAL: {total} PHP
                            </th>
                    </thead>
                    <thead class="orderBtn">
                            <th colspan="5">
                            <input onClick={()=>closeModal()} class="cancelBtn" type="submit" value="Close Cart"/>
                            <input onClick={()=>checkout()} class="checkoutBtn" type="submit" value="Checkout" />
                            <input onClick={()=>cancelCart()} class="cancelBtn" type="submit" value="Cancel Purchase"/>
                            </th>
                    </thead>
                    <thead>

                    </thead>
                    </table>
                </Modal>

                <Modal class="modal"
                    isOpen={modalReceiptOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                >
                    <table class="menu-table">
                       <thead class="orderSummary">
                            <th colspan="2" class="orderSmry"> ORDER SUMMARY:</th>
                       </thead>
                       <tbody>
                       {cartMenuList.map(cartMenu => (
                            <tr key={cartMenu.id}>
                                <td>{cartMenu.name + " " + cartMenu.meal + " (" + cartMenu.qty + ")"}</td>
                                <td>{cartMenu.price}</td>
                            </tr>
                       ))}
                       </tbody>
                       <hr/>
                       <tbody>
                            <tr>
                                <td>{"Subtotal: "}</td>
                                <td>{total}</td>
                            </tr>
                       </tbody>
                       <tbody>
                            <tr>
                                <td>{"Delivery Charge: "}</td>
                                <td>59</td>
                            </tr>
                       </tbody>
                    <thead class="orderSummary">
                            <th colspan="5" class="orderTotal">
                            TOTAL: {total + 59} PHP
                            </th>
                    </thead>
                    <thead class="orderBtn">
                            <th colspan="5">
                            <input onClick = {()=>cancelRecp()}class="cancelBtn" type="submit" value="Go Back"/>
                            <input class="checkoutBtn" type="submit" value="Place Order" onClick={()=>placeOrder()}/>
                            </th>
                    </thead>
                    </table>
                </Modal>
                <Modal class="modal"
                                    isOpen={placeOrderTy}
                                    onRequestClose={closeModal}
                                    style={customStyles}
                                >
                                    <table class="menu-table">
                                    <thead class="orderBtn">
                                            <th colspan="1">
                                            <input onClick = {()=>placeOrder()} class="cancelBtn" type="submit" value="Thank you for ordering"/>
                                            </th>
                                            <th>
                                            <input onClick = {()=>backToHome()} class="checkoutBtn" type="submit" value="Close"/>
                                            </th>
                                    </thead>
                                    </table>
                                </Modal>

                <thead class="thead">
                   <th>Image</th>
                   <th>Name</th>
                   <th>Type</th>
                   <th>Price</th>
                   <th>Quantity:</th>
                </thead>
                <tbody>
                {addMenuList.map(menu => (
                    <tr key={menu.id}>
                        <td><img src={menu.image} width="500" height="600"/></td>
                        <td>{menu.name}</td>
                        <td>{menu.type}</td>
                        <td>{menu.price}</td>
                        <td>
                           <input type="checkbox" class="btn" id="click"/>
                           <span class="click-edit" onClick={() => addToCart(menu)}><FontAwesomeIcon icon={faAdd}/></span>

                            <input type="text" value={menu.qty} class="qnty" disabled/>

                            <input type="checkbox" class="btn" id="click"/>
                            <span class="click-edit" onClick={() => minusToCart(menu)}><FontAwesomeIcon icon={faMinus}/></span>

                            <input type="checkbox" class="btn" id="click"/>
                            <span class="click-edit" onClick={() => addutucart(menu)}><FontAwesomeIcon icon={faShoppingBasket}/></span>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <div className="Sidebar">
                <img src="./mcjollibee.png" className="App-logo" alt="logo" />
               <header> McJollibee </header>
               <ul className="Categories">
                    <li className="Chicken" onClick={() => buildMenuList("chickens")}><a href=""><FontAwesomeIcon icon={faDrumstickBite}/></a> Chicken</li>
                    <li className="Rice Meals" onClick={() => buildMenuList("rices")}><a href="_blank"><FontAwesomeIcon icon={faBowlRice}/></a> Rice Meals</li>
                    <li className="Burger" onClick={() => buildMenuList("burgers")}><a href="_blank"><FontAwesomeIcon icon={faBurger}/></a> Burger</li>
                    <li className="Desserts" onClick={() => buildMenuList("desserts")}><a href="_blank"><FontAwesomeIcon icon={faCandyCane}/></a> Desserts</li>
                    <li className="Snacks" onClick={() => buildMenuList("snacks")}><a href="_blank"><FontAwesomeIcon icon={faIceCream}/></a> Snacks</li>
                    <li className="Extras" onClick={() => buildMenuList("extras")}><a href="_blank"><FontAwesomeIcon icon={faCoffee}/></a> Extras</li>
               </ul>
                <button class="sidebarBtn">
                    <span></span>
                </button>
            </div>
        </div>
    );
}

export default Menu;