pub mod utils;
use std::{
    collections::HashMap,
    ops::Add,
    sync::{Arc, Mutex},
};

use lazy_static::lazy_static;
use wasm_bindgen::{prelude::*, JsObject};
use web_sys::HtmlElement;

lazy_static! {
    pub static ref CACHE_HASHMAP: Arc<Mutex<HashMap<String, f64>>> =
        Arc::new(Mutex::new(HashMap::new()));
}

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}
#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn getDefault() -> Result<f64, JsValue> {
    let mut hashmap = CACHE_HASHMAP.lock().unwrap();
    if let Some(value) = hashmap.get("defaultheight") {
        console_log!("Hit cache");
        return Ok(*value);
    }
    let window = web_sys::window().expect("window 对象不存在");
    let document = window.document().expect(" a document 对象不存在");
    let computedp = document
        .get_element_by_id("computedspan")
        .expect("computedspan 没找到");
    let p = computedp.dyn_ref::<HtmlElement>().expect("类型不一致");
    let offsetHeight = p.offset_height() as f64;
    hashmap.insert(format!("defaultheight"), offsetHeight);
    return Ok(offsetHeight);
}
#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn getContentSpacing(id: &str) -> Result<i32, JsValue> {
    let window = web_sys::window().expect("window not found");
    let mut spacing = 0;
    let document = window.document().expect("  document not found");
    let dom = document.get_element_by_id(id).expect("id对应dom 没找到");
    {
        let content = dom
            .query_selector(".content")
            .expect("找不到content")
            .expect("找不到content");
        let contentStyle = window
            .get_computed_style(&content)
            .expect("沒有Style")
            .expect("沒有Style");
        let paddingTop = contentStyle
            .get_property_value("padding-top")
            .expect("沒有padding-top");
        let paddingBottom = contentStyle
            .get_property_value("padding-bottom")
            .expect("沒有padding-bottom");
        let paddingTop = paddingTop
            .replace("px", "")
            .parse::<i32>()
            .expect("数字转换异常");
        let paddingBottom = paddingBottom
            .replace("px", "")
            .parse::<i32>()
            .expect("数字转换异常");
        let dom = dom.dyn_ref::<HtmlElement>().expect("类型不一致");
        let content = content.dyn_ref::<HtmlElement>().expect("类型不一致");
        spacing = paddingTop + paddingBottom;
        spacing += dom.offset_height() - content.offset_height();
    }
    return Ok(spacing);
}
#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn computedWidth(html: &str) -> Result<f64, JsValue> {
    let mut html: &str = html;
    let mut hashmap = CACHE_HASHMAP.lock().unwrap();
    if let Some(value) = hashmap.get(html) {
        console_log!("Hit cache");
        return Ok(*value);
    }
    let window = web_sys::window().expect("window 对象不存在");
    let document = window.document().expect(" a document 对象不存在");
    let computedp = document
        .get_element_by_id("computedspan")
        .expect("computedspan 没找到");
    if html == " " {
        html = "&nbsp;";
    }
    computedp.set_inner_html(html);
    let rect = computedp.get_bounding_client_rect();
    hashmap.insert(format!("{}", html), rect.width());
    return Ok(rect.width());
}
//"opacity: 0;position: absolute;z-index: -88"
#[wasm_bindgen]
pub fn init_plugn(css: &str, style: &str) -> Result<(), JsValue> {
    let window = web_sys::window().expect("window 对象不存在");
    let document = window.document().expect(" a document 对象不存在");
    let body = document.body().expect("document 应该包含一个body");
    let spanp = body.query_selector("#computedspan")?;
    match spanp {
        Some(_) => {}
        None => {
            // Manufacture the element we're gonna append
            let val = document.create_element("p")?;
            val.set_id("computedspan");
            val.set_class_name(css);
            val.set_inner_html("t");
            let _ = val.set_attribute("style", style);
            body.append_child(&val)?;
        }
    }
    Ok(())
}
#[wasm_bindgen(start)]
fn run() -> Result<(), JsValue> {
    console_log!("启动插件");
    Ok(())
}
