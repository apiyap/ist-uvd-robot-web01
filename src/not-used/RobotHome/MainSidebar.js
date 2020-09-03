import React from "react";
import {
  updateMenuKey,
  updateMenuItemKey,
  getMenuKey,
  getMenuItemKey,
} from "../../features/appSlice";
import { useSelector, useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../logo.svg";
import { isArray } from "jquery";
import { Link } from "react-router-dom";

const myMenus = [
  {
    key: "dashboard",
    name: "Dashboard",
    path: "/home",
    icon: ["fas", "tachometer-alt"],
    active: false,
    items: null,
  },
  {
    key: "robot_control",
    name: "Robot Controls",
    path: "#",
    icon: ["fas", "robot"],
    active: false,
    items: [
      {
        key: "manual",
        name: "Manual",
        path: "/manual",
        icon: ["fas", "gamepad"],
        active: false,
        items: null,
      },
      {
        key: "auto",
        name: "Auto",
        path: "/auto",
        icon: ["fas", "map-marked-alt"],
        active: false,
        items: null,
      },
    ],
  },
];

function MenuItem({ menu }) {
  const dispatch = useDispatch();
  const menuKey = useSelector((state) => getMenuItemKey(state));
  menu.active = menuKey === menu.key;

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();//prevent parent execute
    if(!menu.active)
    {
      dispatch(updateMenuItemKey(menu.key));
    }else{
      dispatch(updateMenuItemKey(''));
    }
  }

  return (
    <>
      <ul className="nav nav-treeview">
        <li className="nav-item">
          <Link
            to={menu.path}
            className={"nav-link" + (menu.active ? " active" : "")}
            onClick={handleClick}
          >
            <FontAwesomeIcon className="nav-icon" icon={menu.icon} />
            <p>{menu.name}</p>
          </Link>
        </li>
      </ul>
    </>
  );
}

function Menu({ menu }) {
  const dispatch = useDispatch();
  const menuKey = useSelector((state) => getMenuKey(state));
  menu.active = menuKey === menu.key;

  const has_tree = isArray(menu.items);
  const nav_cls = has_tree ? " has-treeview" : "";
  const nav_open = menu.active ? " menu-open" : "";
  const ang_icon = has_tree ? (
    <FontAwesomeIcon
      className="right"
      icon={["fas", menu.active ? "angle-down" : "angle-left"]}
    />
  ) : (
    ""
  );
  const menu_items = has_tree
    ? menu.items.map((item) => <MenuItem key={item.key} menu={item} />)
    : "";

  function handleClick(e) {
    if (has_tree) {
      e.preventDefault();
      
    } 
    if(menuKey===menu.key)
    {
      dispatch(updateMenuKey(''));//for toggle
    }else{
      dispatch(updateMenuKey(menu.key));
    }
  }

  return (
    <>
      <li className={"nav-item" + nav_cls + nav_open} onClick={handleClick}>
        <Link
          to={menu.path}
          className={"nav-link " + (menu.active ? " active" : "")}
        >
          <FontAwesomeIcon className="nav-icon" icon={menu.icon} />
          <p>
            {menu.name}
            {ang_icon}
          </p>
        </Link>
        {menu_items}
      </li>
    </>
  );
}

export default function MainSidebar(props) {
  const showCloseBtn = document.body.classList.contains("sidebar-open");

  // const dispatch = useDispatch();
  // const leftMenu =  useSelector((state) => getLeftMenuOpen(state));
  // function handleCloseLefMenu(){
  //   dispatch( toggleLeftMenuOpen())
  // }

  return (
    <aside
      className={
        "main-sidebar sidebar-dark-primary" +
        (showCloseBtn ? " show-close-btn" : " hide-close-btn")
      }
    >
      {/* Brand Logo */}
      <div className="brand-link">
        <img
          src={logo}
          alt="Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">
          <b>UVD</b> Robot
        </span>
        <a href="#" onClick={props.closeMenuClick}>
          <span className="badge navbar-badge">
            <FontAwesomeIcon icon={["fas", "window-close"]} />
          </span>
        </a>
      </div>

      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {myMenus.map((item) => (
              <Menu key={item.key} menu={item} />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
