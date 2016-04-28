 
ReactDOM.render(React.createElement(Viewer, {id: image, type: "full"}), document.getElementById('viewer'));
window.viewer = OpenSeadragon({
  id: 'map',
  prefixUrl: "/osd/static/img/",
  zoomInButton: 'zoom-in-button',
  zoomOutButton: 'zoom-out-button',
  showHomeControl: false,
  showFullPageControl: false,
  tileSources: server + "?Deepzoom=" + image +".dzi"        
});
if (window.embedrViewerType === 'nozoom') {
  window.viewer.gestureSettingsMouse.scrollToZoom = false;
  window.viewer.gestureSettingsMouse.clickToZoom = false;
  window.viewer.gestureSettingsMouse.clickToZoom = false;
  window.viewer.panHorizontal = false;
  window.viewer.panVertical = false;
}