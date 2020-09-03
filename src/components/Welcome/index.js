import React,{useState,useEffect} from "react";
import logo from "../../logo.svg";
import "../../App.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updatePath } from "../../features/appSlice";
import { getStatusLogin } from "../../features/Auth/AuthSlice";
import { useTranslation, Trans } from "react-i18next";
import Flag from "react-world-flags";
import { Container, Carousel, Image, Row, Col } from "react-bootstrap";

function Welcome() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const [holderMount, setHolderMount] = useState(false);


  const status = useSelector((state) => getStatusLogin(state));
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  let homeLink = "";
  if (status === "success") {
    homeLink = (
      <Link className="App-link" to="/dashboard" rel="noopener noreferrer">
        Home
      </Link>
    );
  }

  dispatch(updatePath(window.location.pathname));
  useEffect(() => {
    if(!holderMount)
    {
      setHolderMount(true);
      window.holder();
    }

  }, [holderMount,setHolderMount]); 

  return (
    <div className="App">
      <header className="App-header">
        <div style={{width:'100%'}}>
          <Row>
            <Col>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100 holderjs"
                    data-src="holder.js/800px340?text= &bg=080d17"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                  <Image src={logo}  />
                    <h3><b>UVD</b> Robot </h3>
                    <p>
                    <Trans i18nKey="welcome.carousel.page1.description"> Simple robot description</Trans>
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img

                    className="d-block w-100 holderjs"
                    data-src="holder.js/800px340?text=Second slide&bg=101724"
                    alt="Second slide"
                  />

                  <Carousel.Caption>
                    <h3><Trans i18nKey="welcome.carousel.page2.title">Second slide label</Trans></h3>
                    <p><Trans i18nKey="welcome.carousel.page2.description">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </Trans>
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 holderjs"
                    data-src="holder.js/800px340?text=Third slide&bg=232b3d"
                    alt="Third slide"
                  />

                  <Carousel.Caption>
                    <h3><Trans i18nKey="welcome.carousel.page3.title">Third slide label</Trans></h3>
                    <p>
                    <Trans i18nKey="welcome.carousel.page3.description">
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur.
                      </Trans>
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </div>
        <p>
          <Trans i18nKey="welcome.title">Welcome</Trans>
        </p>
        <Link className="App-link" to="/login" rel="noopener noreferrer">
          <Trans i18nKey="welcome.login">Login</Trans>
        </Link>
        {homeLink}
        <Row>
          <Col>
            <Flag
              className="flag"
              code="th"
              height="16"
              onClick={() => changeLanguage("th-TH")}
            />{" "}
            <Flag
              className="flag"
              code="us"
              height="16"
              onClick={() => changeLanguage("en")}
            />{" "}
            <Flag
              className="flag"
              code="jp"
              height="16"
              onClick={() => changeLanguage("jp")}
            />
          </Col>
        </Row>
      </header>
    </div>
  );
}

export default Welcome;
