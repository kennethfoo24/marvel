import React, { useState } from "react";
import { Button, Typography, Modal } from "antd";
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
  const [avenger, setAvenger] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");

  const handleClick = async (e) => {
    const name = e.currentTarget.getAttribute("data-name");
    try {
      setLoading(true);
      setOpen(true);
      const avenger = await api.selectCharacter(name);
      setAvenger(avenger);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div>
        <Typography.Title style={{ color: "white" }}>
          Welcome to Marvel, {username}
        </Typography.Title>
        <Typography.Title level={4} style={{ color: "white" }}>
          Please select your Avenger character
        </Typography.Title>
      </div>
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
      <Modal
        loading={loading}
        open={open}
        footer=""
        onCancel={() => setOpen(false)}
      >
        <div className="modal">
          <div>
            <ImageComponent
              src={`${process.env.PUBLIC_URL}/${avenger.image}`}
              alt="Avenger image"
              width="150"
              height="150"
              style={{ borderRadius: "50%", border: "2px solid black" }}
            />
          </div>
          <Typography.Title>{avenger.phrase}</Typography.Title>
        </div>
      </Modal>
    </div>
  );
};

export default SelectCharacter;
