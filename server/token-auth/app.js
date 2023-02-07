const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 4001;
app.use(cookieParser());
app.use(express.json()); // 요청에서 넘어온 body data json화

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions)); // 모든 cross origin 요청 허용

// 로그인 API (토큰 인증)
const SECRET_KEY = "mySecretKey"; // 토큰을 만들 때 또는 검증할 때 사용하는 SECRET KEY
app.post("/login", (req, res) => {
  const { id, password } = req.body;
  console.log("req.body:", req.body);

  // 클라이언트에서 받아온 id, password로 DB 에서 회원 정보 있는 거 확인 했다고 가정
  const accessToken = jwt.sign({ id }, SECRET_KEY, { expiresIn: "30m" }); // 토큰 유효기간 30분
  console.log("accessToken from login api:", accessToken);
  res.cookie("accessToken", accessToken);
  return res.status(200).send("로그인 성공!");
});

// 리스트 API (인가)
const productList = [
  { id: 1, name: "product01" },
  { id: 2, name: "product02" },
  { id: 3, name: "product03" },
];

app.get("/product-list", (req, res) => {
  // cookie에서 들어온 sessionId가 세션 저장소에 존재하는 지 확인
  const [_, accessToken] = req.headers["authorization"].split(" ");

  console.log("accessToken:", accessToken);

  if (!accessToken) {
    // 클라이언트 쿠키에서 accessToken이 없으면
    res.status(401).send("쿠키에서 넘어온 엑세스토큰이 없습니다.");
    return;
  }
  // 토큰 검증하여 유효하면 데이터 보내기
  try {
    const result = jwt.verify(accessToken, SECRET_KEY);
    console.log("result:", result);
  } catch (err) {
    console.log("err:", err);
    return res.status(401).send("유효하지 않은 토큰입니다.");
  }
  // 유효한 토큰이므로 DB에서 productList를 가져왔다고 가정.
  return res.status(200).json({ data: productList });
});

app.get("/", (req, res) => {
  res.status(200).send("Hello my server!");
});

app.listen(port, () => {
  console.log(`서버가 포트번호 ${port}에서 열렸습니다.`);
});
