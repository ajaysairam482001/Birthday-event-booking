import { React, useRef, useState, useContext, useEffect } from "react";
import Navbar from "/home/coder/project/workspace/reactapp/src/components/Admin/Navbar/Navbar.js";
import styles from "/home/coder/project/workspace/reactapp/src/components/Admin/AddTheme/AddTheme.module.css";
import { BaseUrl } from "../../../utils/authApi";
import axios from "axios";
import UserContext from "../../../UserContext";
import { useNavigate } from "react-router-dom";

const AddTheme = () => {
  const { appUser, setAppUserl } = useContext(UserContext);
  const themeName = useRef();
  const imageUrl = useRef();
  const photographerDetails = useRef();
  const videographerDetails = useRef();
  const returnGift = useRef();
  const themeCost = useRef();
  const description = useRef();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const jwtToken = appUser?.token;
  console.log("token", jwtToken);
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  async function handleSubmit() {
    console.log("i am handle submit");
    const themeModel = {
      themeName: themeName.current.value,
      themeimgUrl: imageUrl.current.value,
      themephotographer: photographerDetails.current.value,
      themeVideographer: videographerDetails.current.value,
      themeReturnGift: returnGift.current.value,
      cost: themeCost.current.value,
      themeDescription: description.current.value,
    };

    try {
      const res = await axios.post(
        `${BaseUrl}/admin/addTheme`,
        themeModel,
        { headers }
      );
      console.log("return from backend", res.data);
      alert(res.data);

      // Refresh the data after adding the theme
      getAllThemes();

      // Reset the form fields
      themeName.current.value = "";
      imageUrl.current.value = "";
      photographerDetails.current.value = "";
      videographerDetails.current.value = "";
      returnGift.current.value = "";
      themeCost.current.value = "";
      description.current.value = "";
    } catch (e) {
      console.log(e.message);
    }
  }

  const getAllThemes = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/admin/theme`, { headers });
      console.log("res",res.data);
      
      // Reverse the data array to display the last entry first
      const reversedData = res.data.reverse();

      setData(reversedData);
    } catch (error) {
      console.error(error);
    }
  };

  //to fetch the data in starting  without it it will not fetch data
  useEffect(() => {
    getAllThemes();
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.main_content}>
        <div className={styles.container}>
          <div className={styles.theme_form}>
            <div className={styles.form}>
              <input
                type="text"
                placeholder="Enter Theme Name"
                ref={themeName}
              />
              <input type="text" placeholder="Enter Image URL" ref={imageUrl} />
              <input
                type="text"
                placeholder="Enter Photographer Details"
                ref={photographerDetails}
              />
              <div className={styles.add_btn_container}>
                <input
                  type="submit"
                  value="Add Theme"
                  className={styles.add_btn}
                  onClick={handleSubmit}
                />
              </div>
            </div>
            <div className={styles.form}>
              <input
                type="text"
                placeholder="Enter Videographer Details"
                ref={videographerDetails}
              />
              <input
                type="text"
                placeholder="Enter Theme Return Gift"
                ref={returnGift}
              />
              <input
                type="text"
                placeholder="Enter Theme Cost"
                ref={themeCost}
              />
              <textarea
                type="text"
                placeholder="Enter Theme Description"
                cols={20}
                rows={10}
                ref={description}
              />
            </div>
          </div>
          <div className={styles.themes_view}>
            <div className={styles.card_scroll_view}>
              {data?.map((item)=>{
              return(
              <div className={styles.card} key={item.themeId}>
                <img
                  src={item.themeimgUrl}
                  alt=""
                />
                <div className="">
                  <p>{item.themeName}</p>
                  <div className="">
                    <p>{`price:${item.cost}`}</p>
                    <p>{"5 star"}</p>
                  </div>
                </div>
              </div>)})}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTheme;