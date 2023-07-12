mod utils;

use std::{sync::{Mutex}, collections::HashMap};

use wasm_bindgen::prelude::*;
use web_sys::{HtmlElement};

use lazy_static::lazy_static;
lazy_static! {
    pub static ref CACHE_HASHMAP: Mutex<HashMap<String, f64>> = Mutex::new(HashMap::new());
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

#[wasm_bindgen]
pub fn getDefault() -> Result<f64, JsValue>{
    let mut hashmap = CACHE_HASHMAP.lock().unwrap();
    if let Some(value)=hashmap.get("defaultheight"){
        console_log!("Hit cache");
        return Ok(*value);
    }
    let window = web_sys::window().expect("window 对象不存在");
    let document = window.document().expect(" a document 对象不存在");
    let computedp =document.get_element_by_id("computedspan").expect("computedspan 没找到");
    let p = computedp.dyn_into::<HtmlElement>().expect("类型不一致");
    let offsetHeight = p.offset_height() as f64;
    hashmap.insert(format!("defaultheight"), offsetHeight);
    return Ok(offsetHeight);
}


#[wasm_bindgen]
pub fn computedWidth(html:&str) -> Result<f64, JsValue>{
    let mut hashmap = CACHE_HASHMAP.lock().unwrap();
    if let Some(value)=hashmap.get(html){
        console_log!("Hit cache");
        return Ok(*value);
    }
    let window = web_sys::window().expect("window 对象不存在");
    let document = window.document().expect(" a document 对象不存在");
    let computedp =document.get_element_by_id("computedspan").expect("computedspan 没找到");
    computedp.set_inner_html(html);
    let rect =computedp.get_bounding_client_rect();
    hashmap.insert(format!("{}", html), rect.width());
    return Ok(rect.width());
}


#[wasm_bindgen(start)]
fn run() -> Result<(), JsValue> {
   
    let window = web_sys::window().expect("window 对象不存在");
    let document = window.document().expect(" a document 对象不存在");
    let body = document.body().expect("document 应该包含一个body");
    let spanp =body.query_selector("#computedspan")?;
    match spanp {
        Some(_)=>{}
        None=>{
    // Manufacture the element we're gonna append
    let val = document.create_element("p")?;
    val.set_id("computedspan");
    val.set_class_name("text-b");
    val.set_inner_html("t");
    let _=val.set_attribute("style", "opacity: 0;position: absolute;z-index: -88");
    body.append_child(&val)?;
        }
    }
    Ok(())
}
