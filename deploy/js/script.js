function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(".image-upload-wrap").hide();
      $("#loading").show();
      $(".file-upload-image").attr("src", e.target.result);
      $(".file-upload-content").show();
      $(".image-title").html(input.files[0].name);
    };
    reader.readAsDataURL(input.files[0]);
    init().then(function () {
      console.log("hello");
      predict();
      $("#loading").hide();
    });
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $(".file-upload-input").replaceWith($(".file-upload-input").clone());
  $(".file-upload-content").hide();
  $(".image-upload-wrap").show();
}
$(".image-upload-wrap").bind("dragover", function () {
  $(".image-upload-wrap").addClass("image-dropping");
});
$(".image-upload-wrap").bind("dragleave", function () {
  $(".image-upload-wrap").removeClass("image-dropping");
});

let URL;
const urlMale = "https://teachablemachine.withgoogle.com/models/xLKfhg9Xn/";
const urlFemale = "https://teachablemachine.withgoogle.com/models/xLKfhg9Xn/";
let model, webcam, labelContainer, maxPredictions;
async function init() {
  if (document.getElementById("gender").checked) {
    URL = urlMale;
  } else {
    URL = urlFemale;
  }
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    var element = document.createElement("div");
    element.classList.add("d-flex");
    labelContainer.appendChild(element);
  }
}
async function predict() {
  var image = document.getElementById("face-image");
  const prediction = await model.predict(image, false);
  prediction.sort(
    (a, b) => parseFloat(b.probability) - parseFloat(a.probability)
  );
  console.log(prediction[0].className);
  var resultTitle, resultExplain, resultCeleb;
  if (document.getElementById("gender").checked) {
    switch (prediction[0].className) {
      case "egg":
        resultTitle = "달걀형";
        resultExplain =
          "당신은 축복받은 달걀형! 거의 모든 헤어스타일을 무난하게 소화합니다.";
        resultCeleb = "원하는 헤어스타일을 시도해보세요.";
        break;
      case "long":
        resultTitle = "긴 얼굴형";
        resultExplain =
          "긴 얼굴형은 세로에 비해 가로 폭이 다소 좁아 날카로워 보일 수 있습니다. (특히 옆머리를 바짝 자른 투블럭이나 너무 짧은 머리는 날카로워 보일 수 있습니다.) 윗머리를 기르는 경우 얼굴이 더 길어 보이게 하니 조심하세요. 이런 단점을 보완하려면 전체적으로 둥근 느낌의 볼륨을 주어 인상을 부드럽게 만들어보세요.";
        resultCeleb =
          "댄디컷을 추천합니다. 윗머리는 웨이브펌 등으로 볼륨감을 주면 세로 방향의 느낌을 상쇄할 수 있습니다. 볼륨을 최대한 살린 헤어스타일로 긴 얼굴을 짧아 보이게 하는 것이 포인트입니다.";
        break;
      case "round":
        resultTitle = "둥근 얼굴형";
        resultExplain =
          "둥근 얼굴형은 어려 보인다는 장점이 있지만, 자칫 얼굴이 커 보일 수도 있습니다. 이런 단점을 보완하려면 얼굴이 길어 보이도록 스타일링해보세요. 앞머리는 왁스 등의 제품으로 깔끔하게 올려 보세요. 시선을 위쪽으로 분산시켜 둥근 얼굴형이 가름해 보이는 효과를 얻을 수 있습니다.";
        resultCeleb =
          "리젠트 컷을 추천합니다. 앞머리를 시원하게 올려 이마를 드러내보세요. 가르마를 활용해 사선 방향으로 스타일링하면 동그란 얼굴형을 극복할 수 있습니다.";
        break;
      case "angular":
        resultTitle = "각진 얼굴형";
        resultExplain =
          "각진 얼굴형은 남성미가 돋보이지만 날카로운 인상을 줍니다. 얼굴형부터 선이 굵기 때문에 짧은 헤어스타일은 피하는 것이 좋습니다. 적당한 길이의 머리에 앞머리를 자연스럽게 옆으로 넘겨 보는 것도 좋습니다. 이와 함께 윗머리에 볼륨을 주면 부드러운 인상을 자아낼 수 있습니다.";
        resultCeleb =
          "부드러운 인상을 유도하고 싶다면 웨이브 펌을 통해 단점을 커버해보세요. 가볍고 굵은 웨이브가 얼굴 윤곽을 부드럽게 감싸 도회적인 매력을 어필할 수 있습니다. 또한 구레나룻이나 수염을 기르면 시선이 위아래로 퍼져 각진 턱 선이 훨씬 갸름해 보이니 참고하세요.";
        break;
      case "rt":
        resultTitle = "역삼각형 얼굴형";
        resultExplain =
          "얼굴 아래로 갈수록 좁아지는 역삼각형은 시크하고 이지적인 인상을 풍기지만, 넓은 이마와 광대에 비해 턱은 뾰족하기 때문에 신경질적으로 보일 수 있는 단점이 있습니다. 부드러운 실루엣과 풍성한 볼륨을 필수입니다. 상대적으로 좁은 턱 부위가 퍼져 보일 수 있도록 머리를 앞쪽으로 쏠리게 연출해보세요.";
        resultCeleb =
          "소프트 투블럭 스타일을 시도해보세요. 살짝 남긴 구렛나룻에 앞머리는 자연스럽게 내려도, 세워도 멋스럽습니다. 단, 투블럭은 제대로 손질하지 않으면 붕 뜨기 쉬우니 펌을 하거나 머리를 말릴 때 잘 정돈해 줘야 합니다.";
        break;
      default:
        resultTitle = "알수없음";
        resultExplain = "";
        resultCeleb = "";
    }
  } else {
    switch (prediction[0].className) {
      case "egg":
        resultTitle = "달걀형";
        resultExplain =
          "당신은 축복받은 달걀형! 거의 모든 헤어스타일을 무난하게 소화합니다.";
        resultCeleb = "원하는 헤어스타일을 시도해보세요.";
        break;
      case "long":
        resultTitle = "긴 얼굴형";
        resultExplain =
          "당신은 턱이 뾰족한 편이고 얼굴에 볼살이 없어 날카로운 느낌이 드는 긴 얼굴형! 긴 얼굴형은 이마와 턱의 비율보다 눈에서 입까지 중앙부가 더 길고 가로보다 세로 비율이 더 긴 편인 것이 특징이다.";
        resultCeleb =
          "8:2 가르마가 가장 이상적인 가르마이다. 일자로 타는 가르마가 아닌 약간의 곡선형으로 시선을 분산시킨다면 분위기도 살아나고 긴 얼굴형을 확실히 보완할 수 있다. 또한 윗 볼륨은 살리지 말고 옆 볼륨을 살려줘야 가로로 시선이 분산될 수 있다는 점도 알아두자.";
        break;
      case "round":
        resultTitle = "둥근 얼굴형";
        resultExplain =
          "당신은 귀여운 이미지에 속하고 볼살이 많은 편인 둥근 얼굴형! 둥근 얼굴형은 가로 세로 비율이 같고 광대가 도드라진 것이 특징이다.";
        resultCeleb =
          "5:5 가르마가 가장 이상적인 가르마이다. 세로 비율이 조금 더 길어 보이게 시선을 바꿔주면 얼굴형 보완뿐만 아니라 광대뼈까지 보완할 수 있다. 셀프 드라이가 어렵다면 뿌리볼륨펌으로 윗 볼륨을 살려주는 것도 하나의 팁이다.";
        break;
      case "angular":
        resultTitle = "각진 얼굴형";
        resultExplain =
          "당신은 인상이 날카롭고 남성적인 이미지가 강하고 얼굴이 각진 편인 각진 얼굴형! 각진 얼굴형은 얼굴 면적이 넓은 편이고 광대와 턱 선이 유난이 튀어나와있다.";
        resultCeleb =
          "7:3 가르마가 가장 인상적인 가르마이다. 어느 한쪽으로 치우치지도 너무 정가 운대로 나누지도 않는 턱 선을 살짝 가려주며 부드러운 느낌까지 줄 수 있는 눈썹이 시작하는 부분을 중점으로 해서 직선보단 곡선으로 가르마를 연출해보자. 각진 얼굴형은 헤어스타일도 광대 라인부터 들어간 웨이브보다는 턱선밑으로 레이어를 주어 c컬 펌을 도전해보자";
        break;
      case "rt":
        resultTitle = "역삼각형 얼굴형";
        resultExplain =
          "당신은 눈 아래 중앙부보다 이마가 넓은 편이고 이마와 광대가 도드라진 편인 역삼각형 얼굴형! 역삼각형 얼굴형은 이마보다 턱이 짧은 편이고 인상이 날카로울 수 있다.";
        resultCeleb =
          "9:1 가르마가 가장 이상적인 가르마이다. 가르마로 자연스럽게 이마라인을 가려주면 날카로운 이미지보단 부드러운 이미지로 변신해보자. 축축 처지는 생머리보다는 자연스러운 컬감으로 부드러운 이미지를 쉽게 연출할 수 있다.";
        break;
      default:
        resultTitle = "알수없음";
        resultExplain = "";
        resultCeleb = "";
    }
  }
  var title =
    "<div class='" +
    prediction[0].className +
    "-face-title'>" +
    resultTitle +
    "</div>";
  var explain = "<div class='face-explain'>" + resultExplain + "</div>";
  var celeb =
    "<div class='" +
    prediction[0].className +
    "-face-celeb face-celeb'>" +
    resultCeleb +
    "</div>";
  $(".result-message").html(title + explain + celeb);
  var barWidth;
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability.toFixed(2) > 0.1) {
      barWidth = Math.round(prediction[i].probability.toFixed(2) * 100) + "%";
    } else if (prediction[i].probability.toFixed(2) >= 0.01) {
      barWidth = "4%";
    } else {
      barWidth = "2%";
    }
    var labelTitle;
    switch (prediction[i].className) {
      case "egg":
        labelTitle = "달걀형";
        break;
      case "long":
        labelTitle = "긴 얼굴형";
        break;
      case "round":
        labelTitle = "둥근 얼굴형";
        break;
      case "angular":
        labelTitle = "각진 얼굴형";
        break;
      case "rt":
        labelTitle = "역삼각형 얼굴형";
        break;
      default:
        labelTitle = "알수없음";
    }
    var label = "<div class='face-label'>" + labelTitle + "</div>";
    var bar =
      "<div class='bar-container position-relative container'><div class='" +
      prediction[i].className +
      "-box'></div><div class='d-flex justify-content-center align-items-center " +
      prediction[i].className +
      "-bar' style='width: " +
      barWidth +
      "'><span class='d-block percent-text'>" +
      Math.round(prediction[i].probability.toFixed(2) * 100) +
      "%</span></div></div>";
    labelContainer.childNodes[i].innerHTML = label + bar;
  }
}

const NONE_CN = "none";

const popupBtn = document.querySelector("#popup_btn"),
  popup = document.querySelector("#popup");

popupBtn.onclick = () => {
  popup.classList.add(NONE_CN);
};
