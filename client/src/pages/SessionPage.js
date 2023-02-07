import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SessionPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("아직 인증 안됨");
  const [data, setData] = useState([]);
  const BASE_URL = "http://localhost:4000";
  const handleLogin = async () => {
    const response = await axios.post(
      `${BASE_URL}/login`,
      {
        id,
        password,
      },
      { withCredentials: true }
    );
    setId("");
    setPassword("");
    console.log("response:", response);
    if (response.status === 200) {
      setStatus("인증 완료");
    }
  };

  const getData = async () => {
    const response = await axios.get(`${BASE_URL}/product-list`, {
      withCredentials: true,
    });
    console.log("response:", response);
    setData(response.data.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>세션 인증/인가</h1>
      <h3>
        로그인을 통해 등록된 회원임을 인증합니다. 인증 성공 시 쿠키에
        sessionId가 들어옵니다.
      </h3>
      <div>
        <div style={{ width: 30, display: "inline-block" }}>ID:</div>{" "}
        <input value={id} onChange={(e) => setId(e.target.value)} />
      </div>
      <br />
      <div>
        <div style={{ width: 30, display: "inline-block" }}>PW:</div>{" "}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={"password"}
        />
      </div>
      <br />
      <button onClick={() => handleLogin()}>로그인 (인증)</button>
      <span
        style={{
          marginLeft: 10,
          color: status === "인증 완료" ? "green" : "red",
        }}
      >
        {status}
      </span>
      <br />
      <br />
      <h3>
        인가가 필요한 데이터를 요청합니다. 요청 시 쿠키에 들어 있는 sessionId가
        서버로 자동으로 보내집니다.
      </h3>
      <button onClick={() => getData()}>리스트 요청 (인가)</button>
      {data.length === 0 && (
        <div style={{ marginTop: 10 }}>받아온 데이터가 없습니다.</div>
      )}
      {data.map((product) => (
        <div style={{ marginTop: 10 }} key={product.id}>
          제품명: {product.name}
        </div>
      ))}
      <br />
      <br />
      <button onClick={() => navigate("/token")}>
        토큰 인증 페이지로 이동
      </button>
    </div>
  );
}
