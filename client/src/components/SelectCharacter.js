import React, { useState } from "react";
import { Button, Modal, DotLoading } from "antd-mobile";
import { useLocation } from "react-router-dom";
import api from "../Api";
import "./Styles.css";

const characters = [
  {
    key: "ironman",
    label: "Iron Man",
  },
  {
    key: "captainamerica",
    label: "Captain America",
  },
  {
    key: "thor",
    label: "Thor",
  },
  {
    key: "hulk",
    label: "Hulk",
  },
  {
    key: "thanos",
    label: "Thanos",
  },
];

const ImageComponent = ({ src, alt, width, height, style }) => {
  return (
    <img src={src} alt={alt} width={width} height={height} style={style} />
  );
};

const SelectCharacter = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avenger, setAvenger] = useState({ image: "", phrase: "" });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");

  const handleClick = async (e) => {
    const character = e.currentTarget.getAttribute("data-name");
    try {
      setLoading(true);
      setOpen(true);
      const avenger = await api.selectCharacter(character, username);
      if (!!avenger.image) {
        setAvenger(avenger);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: "white" }}>Assemble, {username}!</h1>
      <h4 style={{ color: "white" }}>
        Select your favourite Avenger character
      </h4>

      <div>
        {characters.map((c, i) => (
          <Button
            className="button"
            key={i}
            data-id={i}
            data-name={c.key}
            onClick={handleClick}
            size="large"
          >
            {c.label}
          </Button>
        ))}
      </div>
      <Modal
        visible={open}
        showCloseButton
        closeOnMaskClick
        destroyOnClose
        content={
          loading ? (
            <span style={{ fontSize: 24 }}>
              <DotLoading />
            </span>
          ) : (
            <>
              <ImageComponent
                src={`${process.env.PUBLIC_URL}/${avenger.image}`}
                alt="Avenger image"
                width="150"
                height="150"
                style={{
                  borderRadius: "5%",
                  border: "2px solid black",
                }}
              />
              <h1>{avenger.phrase}</h1>
            </>
          )
        }
        onClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export default SelectCharacter;
