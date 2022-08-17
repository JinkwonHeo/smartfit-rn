# SmartFit

![prescription](./readme-assets/smartfit.png)

<code>#홈트레이닝</code>
<code>#자세교정</code>
<code>#Tensorflow</code>

헬스장에 갈 시간이 나지 않으시나요? 혹은 PT 비용이 너무 비싸서 부담되시나요?
이제는 smartFit가 당신의 운동을 도와드립니다!

SmartFit은 혼자서 운동하더라도 정확한 자세로 운동할 수 있도록 도와주는 홈트레이닝 어플리케이션입니다.
또한 스스로 트레이너가 되어 운동을 공유할 수 있습니다.

<br>

## 목차

- [기획동기](#기획동기)
- [프로젝트 기간](#프로젝트기간)
- [주요기능](#주요기능)
- [기술 스택](#기술-스택)
- [챌린지](#챌린지)
- [프로젝트를 마치며](#프로젝트를-마치며)

## 🔗 배포 & 링크
<details><summary>설치 QR코드</summary>

![chrome_qrcode_1658496422902](https://user-images.githubusercontent.com/102529818/180452391-bcd70eaf-e772-43ba-826b-d4ec26d085dc.png)

  </details>

- [안드로이드 설치파일 링크](https://drive.google.com/file/d/1pcRRX8W0DgumB0mbrOlXS59R5HlHtXdZ/view?usp=sharing)
- [React-Native Repo](https://github.com/JinkwonHeo/smartfit-rn)
- [Backend Repo](https://github.com/JinkwonHeo/smartfit-server)

## 설치방법
### **현재는 안드로이드 운영체제에서만 구동이 가능합니다!**
- QR코드를 이용한 설치방법
1. 휴대폰의 카메라 앱을 켠 후 QR코드를 인식합니다.
2. 인식이 완료되면 나타나는 창에서 주소를 누릅니다.
3. 계정 선택 후 SmartFit을 설치합니다.
    1. *설치 시 구글드라이브 권한설정을 요구하면 권한을 설정해주세요.*
    2. *구글 플레이스토어에 아직 정식으로 등록되지 않은 앱이기 때문에 주의를 요하는 앱이라는 경고문이 뜰 수 있습니다. ‘무시하고 설치'를 누르시면 정상적으로 설치가 진행됩니다.*
- smartfit_final.apk파일을 다운로드받아 설치하는 방법
1. [안드로이드 설치파일 링크](https://drive.google.com/file/d/1pcRRX8W0DgumB0mbrOlXS59R5HlHtXdZ/view?usp=sharing)에서 smartfit_final.apk파일을 다운로드 받습니다.
2. 다운로드 받은 smartfit_final.apk파일을 휴대폰의 '내 파일' 혹은 '파일관리자'앱에서 실행시켜 설치합니다.

<br>

## 기획동기

- 운동을 하고싶지만 헬스장에 갈 시간이 나지 않거나 PT 비용이 너무 비싸다고 느낀적이 있습니다. 혼자 운동을 하고자 인터넷이나 유튜브에서 자료를 찾아보고 따라 해보았지만 제대로 하고 있는 것인지 확신이 들지 않을때가 많았습니다.
- 스스로 하는 운동에 확신이 들지 않았기 때문에 평소 운동을 즐겨하던 지인에게 제가 운동 한 영상을 녹화 후 전송해서 봐달라고 부탁하고 지인으로부터 받은 피드백을 운동에 적용하니 운동이 훨씬 잘 되는것이 느껴졌습니다.
- 내가 원하는 때에 운동하고 피드백을 받을 수 있는 방법이 없을까 생각하다 AI가 자세를 분석해주고 피드백을 받을 수 있는 서비스를 기획하게 되었습니다.

<br>

## 프로젝트기간

***2022년 6월 27일 ~ 7월 15일 (3주)***

<details><summary>1주차 - 기획 및 학습</summary>

- 아이디어 선정 및 검토
- mock up 제작
- 기술스택 검토
- 기술검증
- 새로운 기술스택 학습 (react native, tensorflow)
- 계획 수립

</details>

<details><summary>2주차 - 개발</summary>

- Frontend

  - React native 기본 UI & 라우팅 구현
  - 로그인/로그아웃 구현
  - tensorflow-posenet 구현
  - 운동동작 분석 알고리즘 구현
  - 동영상 녹화 구현
  - firestore이용한 cloud업로드 구현

- Backend

  - node.js환경에서 tensorflow-posenet구동 구현
  - 녹화한 동영상 분석을 서버에서 수행하도록 구현
  - 분석한 동영상으로부터 운동정보 알고리즘 추출 구현

  </details>

<details><summary>3주차 - 개발 및 배포</summary>

- Frontend

  - 앱 UI/UX 작업
  - 트레이너 리스트 구현
  - like 기능 구현
  - 테스트 작성 및 배포

    </details>
  <br>

## 주요기능

https://user-images.githubusercontent.com/102529818/180385315-5f9f9f21-1e9a-4c04-a498-838e14229faf.mp4

- SmartFit UI/UX

https://user-images.githubusercontent.com/102529818/180385330-de9ca5f9-305e-4e2e-958f-a721a47e6c31.mp4

- 홈화면 운동영상
    - 홈화면에서는 smartfit에서 기본으로 제공하는 운동목록을 볼 수 있습니다. 운동 중 하나를 터치하면 운동화면으로 이동합니다.
    - 카메라앞에 전신이 나오도록 서면 운동영상이 재생되고 자세분석을 시작합니다.
    - 운동에 따라 정확한 자세를 취하면 Rep 카운트가 1씩 올라갑니다.
    - Rep가 10이 된다면 홈화면으로 돌아옵니다.

https://user-images.githubusercontent.com/102529818/180385352-6743da84-34ab-4bc3-a0bd-05711affc441.mp4

- 트레이너 페이지
  - 운동동영상을 하나라도 업로드 한 유저는 트레이너가 됩니다.
  - 트레이너를 터치하면 해당 트레이너의 소개와 좋아요 버튼이 나옵니다.
  - 유저가 업로드 한 동영상을 보고 운동할 수 있습니다. 유저가 취한 동작과의 유사도를 측정하여 %로 나타내줍니다.

https://user-images.githubusercontent.com/102529818/180385363-c9c700d5-dc57-4bba-a068-9b9606099250.mp4

- 녹화 페이지
  - 본인의 운동동영상을 녹화할 수 있습니다.
  - 녹화를 마치면 영상을 확인할 수 있습니다.
  - 녹화에 이상이 없다면 업로드페이지로 이동합니다.
  - 동영상을 업로드하면 서버에 자세분석을 자동으로 요청합니다.
  - 사용자는 업로드만 끝난다면 즉시 다른 작업을 할 수 있습니다.

https://user-images.githubusercontent.com/102529818/180385372-47c76a52-b895-4bf5-8d5f-4318f23ca4b6.mp4

- 기타 페이지
  - 내가 업로드 한 동영상을 볼 수 있습니다.
  - 내 프로필 정보를 수정할 수 있습니다.
  - 로그아웃 할 수 있습니다.

## 기술 스택

- React
- React-native
- expo cli
- tensorflow & posenet
- firebase / firestore

<br>

### 기술 스택 선정 이유
- ***react native***<br>
카메라를 이용한 프로젝트이다보니 어떤 플랫폼에서 카메라 사용이 용이할까 생각해보았습니다. <br>
최근에는 웹캠이 기본으로 내장된 개인 노트북이 많이 보급되어있다고 하나 스마트폰만큼 많은 사람들이 노트북을 가지고 있지는 않습니다. 누구나 쉽게 운동하고 피드백을 받을 수 있는 플랫폼에서 개발하고 싶었기 때문에 노트북의 성능적인 이점 대신 접근성이 용이한 스마트폰 앱을 개발할 수 있는 react native를 이용해서 개발하였습니다.
- ***posenet vs movenet*** <br>
구글 tensorflow팀은 최근 movenet이라는 새로운 자세인식 모델을 만들었습니다. 기존 posenet보다 더 정확하고 빠르게 인식하는 모델이라 movenet을 적용해서 프로젝트를 진행하고자 하였습니다. <br>
본 프로젝트에 들어가기 전에 노트북 환경에서 테스트로 구현해 본 movenet은 확실히 posenet보다 정확한 측정이 가능했습니다. 그러나 휴대폰으로 movenet을 구동시켰을 때는 사용자가 매우 불편하다고 느껴질 만큼 느린 측정속도를 보여주었습니다. (갤럭시 s10+ 기준 초당 5fps) <br>
결국 휴대폰으로 movenet모델을 사용하는 것은 무리가 있다고 판단하여 posenet모델을 선택하였습니다. movenet보다는 측정 성능이 좋지 않은 posenet이지만 최대한 정확한 측정을 위해 posenet으로부터 얻은 자세정보를 바탕으로 수행하는 자세측정 알고리즘에 좀 더 많은 시간을 투자하였습니다.
- ***firestore vs aws S3*** <br>
이번 프로젝트는 사용자가 녹화한 동영상을 서버에 업로드해야하는 작업이 있습니다. 따라서 백엔드 클라우드로 많이 사용되는 s3를 사용할 지, 구글 firebase기반의 firestore를 사용할 지 고민하였습니다. <br>
로그인 서비스로 구글 firebase를 사용하면 구글에서 제공하는 firestore 데이터베이스와 storage를 사용하는 것이 비교적 간단하기 때문에 이번 프로젝트에서는 firebase 로그인을 사용함과 동시에 firestore storage를 사용해서 프로필사진과 동영상 등을 업로드하였습니다.
- ***react native cli vs expo cli*** <br>
react native를 처음 개발하려면 native환경에 맞도록 여러가지 설정을 해줘야합니다. 모바일 어플리케이션 개발 초심자에게는 설정이 쉽지않았고 3주 안에 개발을 끝마쳐야 하기 때문에 빠르게 개발을 시작할 수 있는 expo cli를 사용하였습니다.

<br>

## 챌린지
### **react-native적응과 패키지버전과의 사투**
  - 리액트는 jsx문법을 사용해서 웹에 요소를 그려주지만 네이티브는 생소하게도 컴포넌트를 사용해서 모바일 화면에 요소를 그려주었습니다. 그러나 리액트 네이티브 문법에 익숙해지면서 Flatlist로 리스트를 알아서 출력하거나 css가 아닌 StyleSheet를 사용함으로써 페이지 각각의 스타일을 적용할 수 있다는 점 등 오히려 리액트보다 편한 점들이 있었습니다. <br>
  - 처음부터 마지막까지 저를 괴롭혔던 문제는 패키지 문제였습니다.
    리액트에서는 사용하는 리액트 버전에 크게 상관없이 패키지를 사용할 수 있지만 리액트 네이티브에서는 그렇지가 않았습니다.<br>
    이번에 제가 사용한 expo cli는 리액트 네이티브 초기설정을 대신 해 주고 빠르게 개발을 시작하도록 도와줍니다. expo cli는 버전업을 자주 하는데, 버전업을 하면서 지원해 주는 사항들은 많아지지만 expo 버전을 따라오지 못한 패키지는 그대로 사용할 수 없는 경우가 많았습니다. <br>
    처음 문제가 발생한 시점은 프로젝트를 시작하고 초기에 firebase로그인을 구현할 때 였습니다. firebase를 제대로 설치했음에도 불구하고 패키지를 찾을 수 없다는 오류를 맞닥뜨렸는데 여러가지 방법을 시도하다 결국 expo의 버전을 최신버전이 아닌 이전 버전으로 낮췄더니 에러를 해결할 수 있었습니다.
    이외에도 canvas, expo-gl, tensorflow등의 패키지들이 정상적으로 구동되지 않는 경우가 많았지만 사용하는 expo버전과 맞는 패키지버전을 하나하나 찾아가면서 프로젝트를 수행하였습니다.
### **하드웨어(카메라)의 한계로 인한 계획 수정**
  - 유저가 트레이너가 되어 동영상을 녹화하고 업로드하는 방식을 구현하는 중에 카메라기능의 한계로 인해 계획을 크게 수정해야 했습니다. 처음 계획은 동영상 녹화와 posenet을 동시에 구동해서 동영상 녹화/저장 + posenet정보 저장을 한 번에 프론트에서 마무리하고자 했습니다. 그러나 동영상 녹화/저장과 tensorflow는 동시에 쓸 수 없다는 문제가 있었습니다.
  - 이를 해결하기 위해 업로드한 동영상을 서버에서 다운로드 받은 후에 서버측에서 posenet정보를 추출하여 녹화와 분석을 분리하는 방향으로 구현하였습니다.
  - 처음 계획 한 방법이 물리적으로 불가능 하다는 것을 알았을 때는 어떻게 해야하나 정말 많이 고민을 했지만 결국 또 다른 방법을 생각하고 적용해서 프로젝트를 완성하였습니다.
### **수학을 바탕으로 알고리즘 구현**
  - tensorflow posenet으로부터 받아온 정보를 가공하고 유저의 자세와 비교하는 알고리즘을 구현하는 과정에서 수학이 많이 필요했습니다. 기본적인 삼각함수부터 두 데이터군의 유사성을 비교하는 cosine similarity 등 학생시절 많이 들어보고 사용해봤던 개념도 있었고 처음보는 개념도 있었습니다. <br>
    수학 관련 라이브러리를 사용한다면 쉽게 갈 수 있었지만 사용하지 않은 이유는 수학이론에 대해 완벽하게는 이해하지 못하더라도 왜 이 공식을 써야하는지 알고 구현하고 싶었고 앞으로 비슷한 사항을 구현해야 할 때 다시 적용할 수 있도록 익숙해지기 위해 사용하지 않았습니다.
    비록 완벽한 알고리즘은 아니지만 관련된 이론을 학습하고 프로그래밍에 적용해 볼 수 있었습니다.
### **최적화를 위해 Canvas 대신 SVG 사용**
  - 사용자가 운동하는 모습을 카메라로 찍어 실시간으로 골격을 그려주기 위해 Canvas를 사용해서 그려주었습니다. 한 번 분석을 할 때마다 사용자의 신체 주요 포인트에 골격을 그려주었는데 리렌더링이 일어날 때마다 그려준 골격이 깜빡깜빡하는 현상이 확인되었습니다.
  - Canvas는 자바스크립트 API로써 코드를 실행하고 그 결과를 통해 화면에 그려주게 됩니다. 따라서 tensorflow 분석 결과 나온 17개의 포인트를 계산하고 해당 결과를 Canvas를 통해 그려주는 것은 상대적으로 시간이 오래 걸리는 작업입니다.
  - 대신 SVG를 사용함으로써 깜빡하는 현상을 해결할 수 있었고 Google Play Console 기준 CPU 사용량 5.1% 감소, 메모리 사용량 150MB에서 108MB로 약 28% 감소를 얻어낼 수 있었습니다.
### **Firestore 통신 최소화**
  - 클라이언트에서 서버로의 요청 혹은 API호출을 최소화 하는 것은 어떤 프로젝트를 수행하던 필요하지만 이번 프로젝트에서는 mongoDB를 사용하지 않고 firestore cloud서비스를 이용하였기 때문에 통신횟수를 최소화하려고 노력하였습니다. <br>
  firestore는 하루에 무료로 제공되는 사용량이 있지만 이를 모두 사용하면 요금이 청구됩니다. 사용자 입장에서는 한 번의 요청이지만 어플리케이션을 서비스하는 입장에서는 여러 사용자의 요청을 처리해야 하므로 서비스비용이 매우 늘어날 수 있다는 생각이 들었습니다. 따라서 사용자의 경험을 저하시키지 않으면서 통신을 최소화하여 서비스 품질과 비용을 모두 잡을 수 있도록 하였습니다. <br>

 <details><summary>통신 최소화를 위한 구현 사항</summary>

  - 동영상 썸네일을 추출 후 로컬(어플리케이션)에 저장하였습니다. <br>
  - 사용자 프로필 수정을 할 때 바뀐 사항에 대해서만 통신이 일어나도록 구현하였습니다. 만약 변경사항이 없으면 통신하지 않습니다.<br>
  - 화면을 이동해도 새로고침이 일어나지 않도록 구현하였습니다. (사용자가 새로고침하면 새로고침 수행)<br>
  - 동영상 녹화 시 용량을 제한하였습니다. 이미지분석 성능이 저하되지 않는 선에서 동영상 화질을 낮춰서 업로드하여 녹화시간을 늘렸습니다.

    </details>
<br>

## 프로젝트를 마치며
### **온전히 스스로 해낸 프로젝트**

팀프로젝트때는 부족하다고 느낀 점들을 팀원과 같이 보완해가면서 수행해나갔지만 개인 프로젝트는 모든 것을 혼자 결정하고 완성해야했습니다. <br>
처음 개인프로젝트를 시작할 때는 스스로의 실력에 아직 확신이 없어서 결과를 제대로 낼 수 있을지 걱정됐지만 계획을 확실하게 세우고 하나하나 달성해나가다 보니 어느 순간 결과물이 완성되어 있었습니다.<br>
이렇게 프로젝트의 시작부터 끝까지 혼자서 해냄으로써 앞으로 어려운 문제와 맞닥뜨리더라도 스스로 해결해낼 수 있다는 자신감을 얻을 수 있었습니다.

### **상태관리 툴에 대한 아쉬움**

이번 프로젝트에서 별도의 상태관리 툴을 사용하지 않은 이유는 리액트 네이티브는 컴포넌트 간에 props전달을 많이 하지 않고 부모 컴포넌트로부터 상태를 받기 위한 drilling이 심하지 않기 때문입니다. 따라서 리액트에서 기본적으로 제공해주는 context api 기능으로 반드시 필요한 상태만 전역적으로 관리해주었습니다. <br>
그러나 리액트를 사용한다면 같이 자주 사용하는 redux, 혹은 recoil, react-query등 다양한 상태관리 툴들을 사용해보고 학습해보지 못한 점은 프로젝트를 마무리 한 시점에서 아쉬움이 남습니다. <br>
이후에 react-redux를 사용해서 프로젝트를 리팩토링하고 새로운 기능을 추가하면서 redux를 활용하도록 보완할 예정입니다

### **프로그래밍을 잘 하기 위한 요소**

프로젝트를 수행하면서 프로그래밍을 잘 하기 위해서는 코딩뿐만 아니라 다양한 배경지식이 필요하다는 점을 알게되었습니다. 예를 들어 이번 프로젝트에서 알고리즘을 구현할 때 수학적 지식이 좀 더 있었다면 정확한 알고리즘 구현이 가능했을 것으로 생각됩니다. <br>
프로그래밍은 서비스를 만드는 것이기 때문에 요구사항을 잘 구현하기 위한 배경지식을 학습하고 프로젝트에 빠르게 적용하는 능력도 중요하다는 점을 느꼈습니다. 앞으로의 개발을 통해 접하게 되는 다양한 배경지식을 하나의 프로젝트가 끝나면 잊어버리는 것이 아닌 다양한 프로젝트에서 적용할 수 있도록 정리하고 체득하도록 노력할 예정입니다.
