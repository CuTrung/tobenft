const API_BACKEND = "ws://localhost:3000";

const auth = {
    accessToken: 123,
    refreshToken: 456
}
const locationSocket = io(`${API_BACKEND}/location`, { auth });

const data = {
    locationId: 1,
    // Ban đầu chỉ cần gửi pieceId
    pieceId: 1,
    userLng: 6,
    userLat: 7
}
// Bên frontend sẽ gửi pieceId realtime để check quantity piece còn ko. Vào lần check cuối cùng nếu quantity còn, đồng thời distance user còn khoảng 50 m thì gửi data đầy đủ
locationSocket.emit('pickup-piece', { body: data }, (res) => {
    console.log(">>> CHeck res", res);
});
