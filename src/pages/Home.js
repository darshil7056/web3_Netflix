import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ConnectButton,
  Icon,
  TabList,
  Tab,
  Button,
  Modal,
  useNotification,
} from "web3uikit";
import { Logo } from "../images/Netflix";
import "./Home.css";
import { movies } from "../helpers/library";
import { useMoralis } from "react-moralis";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();
  const [myMovies, setMyMovies] = useState();
  const { isAuthenticated, Moralis, account } = useMoralis();
  const dispatch = useNotification();

  const handleNewNotification = () => {
    dispatch({
      type: "error",
      message: "Pleaser Connect Your Crypto Wallet",
      title: "Not Authenticated",
      position: "topL",
    });
  };
  const handleSuccessNotification = () => {
    dispatch({
      type: "success",
      message: "Movie Added to List",
      title: "Success",
      position: "topL",
    });
  };
  const fetchMyList = async () => {
    const myList = await Moralis.Cloud.run("myDataArray", { addrs: account });
    console.log(myList);
    const filteredArray = movies.filter(function (e) {
      return myList.indexOf(e.Name) > -1;
    });

    setMyMovies(filteredArray);
    console.log(filteredArray);
  };
  const setMyList = async (movieName) => {
    console.log(movieName);
    await Moralis.Cloud.run("setDataArray", {
      addrs: account,
      newFav: movieName,
    });
    handleSuccessNotification();
    fetchMyList();
  };
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyList();
    }
  }, [account]);

  return (
    <>
      <div className="logo">
        <Logo />
      </div>
      <div className="connect">
        <Icon fill="#ffffff" size={24} svg="bell" />
        <ConnectButton />
      </div>
      <div className="topBanner">
        <TabList defaultActiveKey={1} tabStyle="bar">
          <Tab tabKey={1} tabName={"Movies"}>
            <div className="scene">
              <img src={movies[0].Scene} className="sceneImg" />
              <img src={movies[0].Logo} className="sceneLogo" />
              <p className="sceneDesc">{movies[0].Description} </p>
              <div className="playButton">
                <Button
                  icon="chevronRightX2"
                  text="Play"
                  theme="secondary"
                  type="button"
                />
                <Button
                  icon="plus"
                  text="Add to My List"
                  theme="translucent"
                  type="button"
                  onClick={() => {
                    console.log(myMovies);
                  }}
                />
              </div>
            </div>
            <div className="title">Movies</div>
            <div className="thumbs">
              {movies &&
                movies.map((e) => {
                  return (
                    <img
                      src={e.Thumnbnail}
                      className="thumbnail"
                      onClick={() => {
                        setSelectedFilm(e);
                        setVisible(true);
                      }}
                    ></img>
                  );
                })}
            </div>
          </Tab>
          <Tab tabKey={2} tabName={"Series"}></Tab>
          <Tab tabKey={3} tabName={"MyList"}>
            <div className="ownListContent">
              <div className="title">Your Library</div>
              {myMovies && isAuthenticated ? (
                <>
                  {myMovies &&
                    myMovies.map((e) => {
                      return (
                        <img
                          src={e.Thumnbnail}
                          className="thumbnail"
                          onClick={() => {
                            setSelectedFilm(e);
                            setVisible(true);
                          }}
                        ></img>
                      );
                    })}
                </>
              ) : (
                <div className="ownThumbs">
                  You need to authenticate to view your list
                </div>
              )}
            </div>
          </Tab>
        </TabList>
        {selectedFilm && (
          <div className="modal">
            <Modal
              onCloseButtonPressed={() => setVisible(false)}
              isVisible={visible}
              hasFooter={false}
              width="1000px"
            >
              <div className="modalContent">
                <img src={selectedFilm.Scene} className="modalImg"></img>
                <img className="modalLogo" src={selectedFilm.Logo}></img>
                <div className="modalPlayButton">
                  {isAuthenticated ? (
                    <>
                      <Link to="/player" state={selectedFilm.Movie}>
                        <Button
                          icon="chevronRightX2"
                          text="Play"
                          theme="secondary"
                          type="button"
                        />
                      </Link>
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={() => setMyList(selectedFilm.Name)}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        icon="chevronRightX2"
                        text="Play"
                        theme="secondary"
                        type="button"
                        onClick={handleNewNotification}
                      />

                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={handleNewNotification}
                      />
                    </>
                  )}
                </div>
                <div className="movieinfo">
                  <div className="description">
                    <div className="details">
                      <span>{selectedFilm.year}</span>
                      <span>{selectedFilm.Duration}</span>
                    </div>
                    {selectedFilm.Description}
                  </div>
                  <div className="detailedInfo">
                    Genre:<span className="deets">{selectedFilm.Genre}</span>{" "}
                    <br />
                    Actors:<span className="deets">{selectedFilm.Actors}</span>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
