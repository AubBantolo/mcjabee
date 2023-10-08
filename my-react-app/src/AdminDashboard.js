import './AdminDashboard.css';
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
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, ConditionalLink } from "react-router-dom";
import Modal from 'react-modal';

const baseURL = "http://localhost:8080";

function AdminDashboard() {


  return (
    <div className="Dashboard">
     {Sidebar()} {/*this will call another function to display here*/}
      <header className="App-header">
      </header>
    </div>
  );
}

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);

    const loggedUser = location.state.user;
    console.log(loggedUser);

    const [usersList, setUsersList] = React.useState([]);
    const [userId, setUserId] = React.useState('');
    const [userPassword, setUserPassword] = React.useState('');

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalInsertOpen, setInsertOpen] = React.useState(false);

    const [selectedValue, setSelectedValue] = React.useState('');
    const [selectedName, setSelectedName] = React.useState('');
    const [selectedEmail, setSelectedEmail] = React.useState('');
    const [selectedPhone, setSelectedPhone] = React.useState('');
    const [staffVisibility, setStaffVisibility] = React.useState('');
    const [inventoryVisibility, setInventoryVisibility] = React.useState('hidden');
    const [addInventoryList, setAddInventoryList] = React.useState([{}]);
    const [dashInventoryList, setDashInventoryList] = React.useState([{}]);

    const handleName = (event) => {
        setSelectedName(event.target.value);
    };

    const handleEmail = (event) => {
        setSelectedEmail(event.target.value);
    };

    const handlePhone = (event) => {
        setSelectedPhone(event.target.value);
    };

    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleQtyChange = (event, newItem) => {
        if (addInventoryList.some(item => item.id === newItem.id)) {
          setAddInventoryList(addInventoryList => addInventoryList.map(item => item.id === newItem.id
            ? { ...item, stockQty: event.target.value }
            : item,
          ));
        }
    };

    const updateInventory = () => {
        axios.put(baseURL + "/api/updateInventory", addInventoryList)
                .then((response) => {
                        setAddInventoryList(response.data);
                      })
                      .catch(error => {
                      });
    }

    const buildInventoryList = (type) => {
        console.log(addInventoryList);
        console.log(type);
        setStaffVisibility("hidden");
        setInventoryVisibility("");
        axios.get(baseURL + "/api/inventoryStream/" + type)
            .then((response) => {
                setAddInventoryList(response.data);
            }).catch(error => {
            });
    }

    function openStaffTable() {
        setInventoryVisibility("hidden");
        setStaffVisibility("");
    }

    const options = [
      { value: 'admin', label: 'Admin' },
      { value: 'staff', label: 'Staff' },
      { value: 'kitchen', label: 'Kitchen' },
      { value: 'cashier', label: 'Cashier' }
    ];

    const openModal = (user) => {
      setUserId(user.id)
      setSelectedValue(user.role)
      setSelectedName(user.name)
      setSelectedEmail(user.email)
      setSelectedPhone(user.phone)
      setUserPassword(user.password)
      setIsOpen(true);
    }

    const openInsertModal = (user) => {
      setSelectedValue(user.role)
      setSelectedName(user.name)
      setSelectedEmail(user.email)
      setSelectedPhone(user.phone)
      setInsertOpen(true);
    }

    const customStyles = {
      content: {
        background: 'transparent',
        border: '0px'
      },
    };

    const addStockQuantity = (newItem) => {
      if (addInventoryList.some(item => item.id === newItem.id)) {
        setAddInventoryList(addInventoryList => addInventoryList.map(item => item.id === newItem.id
          ? { ...item, stockQty: parseInt(item.stockQty, 10) + 1 }
          : item,
        ));
      } else {
        setAddInventoryList(addInventoryList => [...addInventoryList, newItem]);
      }
    }

    const minusStockQuantity = (newItem) => {
      if (addInventoryList.some(item => item.id === newItem.id)) {
        setAddInventoryList(addInventoryList => addInventoryList.map(item => item.id === newItem.id
          ? { ...item, stockQty: parseInt(item.stockQty, 10) - 1 }
          : item,
        ));
      }
    }

    function closeModal() {
      setIsOpen(false);
    }

    function closeInsertModal() {
      setInsertOpen(false);
    }

    const deleteUser = (id) => {
        axios.delete(baseURL + "/api/deleteUser/" + id)
        .then(() => {
                window.location.reload();
              })
              .catch(error => {
              });
    }

    const updateUser = (user) => {
        console.log(user);
        axios.put(baseURL + "/api/updateUser", user)
        .then(() => {
                window.location.reload();
              })
              .catch(error => {
              });
    }

    const createUser = (user) => {
        axios.post(baseURL + "/api/createUser", user)
        .then(() => {
                window.location.reload();
              })
              .catch(error => {
              });
    }

   useEffect(() => {
             axios.get(baseURL + "/api/findAllUsers")
               .then((response) => {
                 setUsersList(response.data);
               })
               .catch((error) => {
                 console.error(error);
               });

                       axios.get(baseURL + "/api/findAllInventory")
                           .then((response) => {
                               setAddInventoryList(response.data);
                           }).catch(error => {
                           });
       $('.sidebarBtn').click(function() {
       $('.Sidebar').toggleClass('active');
       $('.Sidebar').toggleClass('toggle');
     });
   }, []);

  return (
    <div>
            <table class="table" hidden={inventoryVisibility}>
                <input class="addPerson" type="submit" value="Update Inventory" onClick={() => updateInventory()}/>
                <input class="logoutBtn" type="submit" value="Logout" onClick={() => navigate("/")} />

                <Modal class="modal"
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                >
                <table class="menu-table">
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
                {addInventoryList.map(inventory => (
                    <tr key={inventory.id}>
                        <td><img src={inventory.image} width="500" height="600"/></td>
                        <td>{inventory.name}</td>
                        <td>{inventory.type}</td>
                        <td>{inventory.price}</td>
                        <td>
                            <input type="checkbox" class="btn" id="click"/>
                            <span class="click-edit" onClick={() => addStockQuantity(inventory)}><FontAwesomeIcon icon={faAdd}/></span>

                            <input type="text" onChange={(e) => handleQtyChange(e, inventory)} value={inventory.stockQty} class="qnty"/>

                            <input type="checkbox" class="btn" id="click"/>
                            <span class="click-edit" onClick={() => minusStockQuantity(inventory)}><FontAwesomeIcon icon={faMinus}/></span>


                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        <table class="table" hidden={staffVisibility}>
        <input class="addPerson" type="submit" value="Add new person?" onClick={() => openInsertModal({})}/>
        <input class="logoutBtn" type="submit" value="Logout" onClick={() => navigate("/")} />
                            <Modal class="modal"
                                isOpen={modalInsertOpen}
                                onRequestClose={closeInsertModal}
                                style={customStyles}
                              >
                              <div class="center">
                                          <div class="content">
                                              <div class="header">
                                                  <h2>Edit information?</h2>
                                                  <span class="close-modal" onClick={() => closeInsertModal({})}><FontAwesomeIcon icon={faPencilAlt}/></span>
                                              </div>
                                          	<form>
                                          		<p>
                                          			<span>Username: </span>
                                          			<input id="username" type="text" required="required" value={selectedName} onChange={handleName}/>
                                          		</p>
                                          		<p>
                                          			<span>Email: </span>
                                          			<input id="email" type="text" required="required" value={selectedEmail} onChange={handleEmail}/>
                                          		</p>
                                          		<p>
                                                     <span>Phone: </span>
                                                     <input id="phone" type="text" required="required" value={selectedPhone} onChange={handlePhone}/>
                                                  </p>
                                                  <p>
                                                      <span>Role: </span>
                                                      <select value={selectedValue} onChange={handleSelectChange}>
                                                      <option value='Choose' selected disabled hidden>Choose option:</option>
                                                        {options.map((option) => (
                                                          <option key={option.value} value={option.value}>{option.label}</option>
                                                        ))}
                                                      </select>
                                                  </p>
                                          	</form>

                                          <input class="submit" id="addButton" type="submit" value="Add this person?"
                                          onClick={() => createUser({
                                                                     "name": selectedName,
                                                                     "phone": selectedPhone,
                                                                     "role": selectedValue,
                                                                     "email": selectedEmail
                                                                    })}/>
                                          <div class="line"></div>
                                          </div>
                                      </div>
                              </Modal>

            <thead class="thead">
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Choose:</th>
            </thead>
                <tbody>
                {usersList.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>
                            <input type="checkbox" class="btn" id="click"/>
                            <span class="click-edit" onClick={() => openModal(user)}><FontAwesomeIcon icon={faPencilAlt}/></span>

                              <Modal class="modal"
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                style={customStyles}
                              >
                              <div class="center">
                                          <div class="content">
                                              <div class="header">
                                                  <h2>Edit information?</h2>
                                                  <span class="close-modal" onClick={() => closeModal({})}><FontAwesomeIcon icon={faPencilAlt}/></span>
                                              </div>
                                          	<form>
                                          		<p>
                                          			<span>Username: </span>
                                          			<input id="username" type="text" required="required" value={selectedName} onChange={handleName}/>
                                          		</p>
                                          		<p>
                                          			<span>Email: </span>
                                          			<input id="email" type="text" required="required" value={selectedEmail} onChange={handleEmail}/>
                                          		</p>
                                          		<p>
                                                      <span>Phone: </span>
                                                      <input id="phone" type="text" required="required" value={selectedPhone} onChange={handlePhone}/>
                                                  </p>
                                                  <p>
                                                      <span>Role: </span>
                                                      <select value={selectedValue} onChange={handleSelectChange}>
                                                        {options.map((option) => (
                                                          <option key={option.value} value={option.value}>{option.label}</option>
                                                        ))}
                                                      </select>
                                                  </p>
                                          	</form>
                                          <input class="submit" id="updateButton" type="submit" value="Submit Changes"
                                          onClick={() => updateUser({
                                                                     "id": userId,
                                                                     "name": selectedName,
                                                                     "phone": selectedPhone,
                                                                     "role": selectedValue,
                                                                     "email": selectedEmail,
                                                                     "password": userPassword
                                                                    })}/>
                                          <div class="line"></div>
                                          </div>
                                      </div>
                              </Modal>

                            <input type="checkbox" class="btn" id="btn"/>
                            <span class="click-edit" onClick={() => deleteUser(user.id)}><FontAwesomeIcon icon={faTimes}/></span>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
       <div className="Sidebar">
       <img src="./mcjollibee.png" className="App-logo" alt="logo" />
       <header> McJollibee </header>
       <h3><i> Inventory </i></h3>
       <ul className="Categories">
            <li className="Staff" onClick={openStaffTable}><a href="_blank"><FontAwesomeIcon icon={faUser}/></a> Staff</li>
            <li className="Chicken" onClick={() => buildInventoryList("chickens")}><a href=""><FontAwesomeIcon icon={faDrumstickBite}/></a> Chicken</li>
            <li className="Rice Meals" onClick={() => buildInventoryList("rices")}><a href="_blank"><FontAwesomeIcon icon={faBowlRice}/></a> Rice Meals</li>
            <li className="Burger" onClick={() => buildInventoryList("burgers")}><a href="_blank"><FontAwesomeIcon icon={faBurger}/></a> Burger</li>
            <li className="Desserts" onClick={() => buildInventoryList("desserts")}><a href="_blank"><FontAwesomeIcon icon={faCandyCane}/></a> Desserts</li>
            <li className="Snacks" onClick={() => buildInventoryList("snacks")}><a href="_blank"><FontAwesomeIcon icon={faIceCream}/></a> Snacks</li>
            <li className="Extras" onClick={() => buildInventoryList("extras")}><a href="_blank"><FontAwesomeIcon icon={faCoffee}/></a> Extras</li>
       </ul>

        <button class="sidebarBtn">
            <span></span>
        </button>
        </div>
    </div>
  );
}

export default AdminDashboard;
