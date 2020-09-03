import React from "react";
import {
  updateMenuKey,
  updateMenuItemKey,
  getMenuKey,
  getMenuItemKey,
} from "../../features/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../logo.svg";
import { isArray } from "jquery";
import { Link } from "react-router-dom";

const myMenus = [
  {
    key: "run",
    name: "Run",
    path: "/run",
    icon: ["fas", "tablet-alt"],
    active: true,
    items: null,
  },
  {
    key: "dashboard",
    name: "Dashboard",
    path: "/dashboard",
    icon: ["fas", "tachometer-alt"],
    active: true,
    items: null,
  },
  // {
  //   key: "model",
  //   name: "Model",
  //   path: "/model",
  //   icon: ["fas", "robot"],
  //   active: true,
  //   items: null,
  // },

  {
    key: "robot_control",
    name: "Controls",
    path: "#",
    icon: ["fas", "robot"],
    active: false,
    items: [
      {
        key: "manual2d",
        name: "Manual 2D",
        path: "/manual2d",
        icon: ["fas", "gamepad"],
        active: false,
        items: null,
      },
      {
        key: "manual",
        name: "Manual 3D",
        path: "/manual",
        icon: ["fas", "gamepad"],
        active: false,
        items: null,
      },
      // {
      //   key: "auto",
      //   name: "Auto",
      //   path: "/auto",
      //   icon: ["fas", "map-marker-alt"],
      //   active: false,
      //   items: null,
      // },
      // {
      //   key: "dock",
      //   name: "Dock",
      //   path: "/dock",
      //   icon: ["fas", "charging-station"],
      //   active: false,
      //   items: null,
      // },
    ],
  },
  // {
  //   key: "monitor",
  //   name: "Monitor",
  //   path: "/monitor",
  //   icon: ["fas", "chart-line"],
  //   active: false,
  //   items: null,
  // },
  {
    key: "maps",
    name: "Maps",
    path: "#",
    icon: ["fas", "map-marked-alt"],
    active: false,
    items: [
      {
        key: "map_create",
        name: "Create map",
        path: "/mapcreate",
        icon: ["fas", "map"],
        active: false,
        items: null,
      },
      {
        key: "map_edit",
        name: "Edit map",
        path: "/mapedit",
        icon: ["fas", "map-marked"],
        active: false,
        items: null,
      },
    ],
  },
  {
    key: "room",
    name: "Rooms",
    path: "/rooms",
    icon: ["fas", "city"],
    active: false,
    items: null,
  },

  {
    key: "schedule",
    name: "Schedule",
    path: "/schedule",
    icon: ["fas", "calendar-alt"],
    active: false,
    items: null,
  },
  {
    key: "users",
    name: "Users",
    path: "/users",
    icon: ["fas", "users-cog"],
    active: false,
    items: null,
  },
  {
    key: "options",
    name: "Options",
    path: "/options",
    icon: ["fas", "cogs"],
    active: false,
    items: null,
  },

  // {
  //   key: "options1",
  //   name: "Options1",
  //   path: "/options",
  //   icon: ["fas", "cogs"],
  //   active: false,
  //   items: null,
  // },
  // {
  //   key: "options2",
  //   name: "Options2",
  //   path: "/options",
  //   icon: ["fas", "cogs"],
  //   active: false,
  //   items: null,
  // },
  // {
  //   key: "options3",
  //   name: "Options3",
  //   path: "/options",
  //   icon: ["fas", "cogs"],
  //   active: false,
  //   items: null,
  // },
];

function MenuItem({ menu, onMenuclick }) {
  const dispatch = useDispatch();
  const menuKey = useSelector((state) => getMenuItemKey(state));
  menu.active = menuKey === menu.key;

  function handleClick(e) {
    //e.preventDefault();
    e.stopPropagation(); //prevent parent execute
    // if (!menu.active) {
    dispatch(updateMenuItemKey(menu.key));
    onMenuclick();
    // } else {
    //   dispatch(updateMenuItemKey(""));
    // }
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

function Menu({ menu, onMenuclick }) {
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
    ? menu.items.map((item) => <MenuItem key={item.key} menu={item}  onMenuclick={onMenuclick}/>)
    : "";

  function handleClick(e) {
    if (has_tree) {
      e.preventDefault();
    }
    if (menuKey === menu.key) {
      //dispatch(updateMenuKey("")); //for toggle
    } else {
      dispatch(updateMenuKey(menu.key));
      if (!has_tree) onMenuclick();
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
        <OverlayScrollbarsComponent>
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {myMenus.map((item) => (
                <Menu
                  key={item.key}
                  menu={item}
                  onMenuclick={props.closeMenuClick}
                />
              ))}
            </ul>
          </nav>
        </OverlayScrollbarsComponent>
      </div>
    </aside>
  );
}
