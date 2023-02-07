const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 4000;
app.use(cookieParser());
app.use(express.json()); // 요청에서 넘어온 body data json화

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions)); // 모든 cross origin 요청 허용

// 세션 저장소
let session = {};

// 로그인 API (세션 인증)
app.post("/login", (req, res) => {
  const { id, password } = req.body;
  console.log("req.body:", req.body);

  // DB 에서 client에서 받아온 id, password에 해당하는 회원 정보 있는 거 확인 했다고 가정
  const newSessionId = uuidv4();
  session[newSessionId] = { id };

  res.cookie("sessionId", newSessionId); // 응답 헤더의 Set-Cookie 속성에 쿠키 값 할당
  return res.status(200).send("로그인 성공");
});

// 리스트 API (인가)
const productList = [
  { id: 1, name: "product01" },
  { id: 2, name: "product02" },
  { id: 3, name: "product03" },
];

app.get("/product-list", (req, res) => {
  // cookie에서 들어온 sessionId가 세션 저장소에 존재하는 지 확인

  const { sessionId } = req.cookies;
  if (!sessionId) {
    // 클라이언트 쿠키에서 sessionId가 없거나 세션 저장소에 해당 세션 ID없다면 세션 만료
    res.status(401).send("쿠키에서 넘어온 세션ID가 없습니다.");
    return;
  }
  if (!session[sessionId]) {
    res
      .status(401)
      .send(
        "세션 저장소에 해당 sessionId가 존재하지 않습니다. 세션 만료 상태. 다시 로그인 해주세요"
      );
    return;
  }
  // DB 에서 해당 데이터(productList) 가져왔다고 가정
  return res.status(200).json({ data: productList });
});

app.get("/", (req, res) => {
  res.status(200).send("Hello my server!");
});

app.listen(port, () => {
  console.log(`서버가 포트번호 ${port}에서 열렸습니다.`);
});
