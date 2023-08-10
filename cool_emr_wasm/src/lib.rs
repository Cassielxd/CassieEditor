pub mod utils;
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use js_sys::parse_float;
use lazy_static::lazy_static;
use wasm_bindgen::prelude::*;
use web_sys::HtmlElement;

lazy_static! {
    pub static ref CACHE_HASHMAP: Arc<Mutex<HashMap<String, f64>>> =
        Arc::new(Mutex::new(HashMap::new()));
}

#[wasm_bindgen]
extern "C" {

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

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
pub fn getContentSpacing(id: &str) -> Result<f64, JsValue> {
    let window = web_sys::window().expect("window not found");
    let document = window.document().expect("  document not found");
    let dom = document.get_element_by_id(id).expect("id对应dom 没找到");
    let spacing = {
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
        let paddingTop = parse_float(&paddingTop);

        let paddingBottom = contentStyle
            .get_property_value("padding-bottom")
            .expect("沒有padding-bottom");
        let paddingBottom = parse_float(&paddingBottom);

        let marginTop = contentStyle
            .get_property_value("margin-top")
            .expect("沒有margin-top");
        let marginTop = parse_float(&marginTop);

        let marginBottom = contentStyle
            .get_property_value("margin-bottom")
            .expect("沒有margin-bottom");

        let marginBottom = parse_float(&marginBottom);
        let padding = paddingTop + paddingBottom;
        let margin = marginTop + marginBottom;
        let dom = dom.dyn_ref::<HtmlElement>().expect("类型不一致");
        let content = content.dyn_ref::<HtmlElement>().expect("类型不一致");
        padding + margin + (dom.offset_height() - content.offset_height()) as f64
    };
    return Ok(spacing);
}
#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn computedWidth(html: &str) -> Result<f64, JsValue> {
    let mut html: &str = html;
    let mut hashmap = CACHE_HASHMAP.lock().unwrap();
    if let Some(value) = hashmap.get(html) {
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

#[wasm_bindgen]
pub fn init_plugn(css: &str, style: &str) -> Result<(), JsValue> {
    let window = web_sys::window().expect("window 对象不存在");
    let document = window.document().expect(" a document 对象不存在");
    let body = document.body().expect("document 应该包含一个body");
    let spanp = body.query_selector("#computedspan")?;
    match spanp {
        Some(q) => {
            let _ = body.remove_child(&q);
            let val = document.create_element("p")?;
            val.set_id("computedspan");
            val.set_class_name(css);
            val.set_inner_html("t");
            let _ = val.set_attribute("style", style);
            body.append_child(&val)?;
        }
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
    console_log!("联系作者：348040933@qq.com");
    Ok(())
}
