# pdf-preview

在单个 canvas 中分页预览 pdf

缓存上一帧像素数据，需要计算出哪些页面需要新渲染出来

计算出前后时候差集矩形，一个或者两个。与差集部分相交的页面需要渲染

![image-20231113114754121](assets/缓存上一帧渲染.png)

计算滚动条大小及位置

![image-20231113133858379](assets/计算滚动条.png)

滚动条需要有最小大小

![image-20231113133811397](assets/滚动条最小大小.png)

### 未缩放状态下复用上一帧图像数据

复制上一帧图像数据进行相对位移时需要考虑`浮点数精度问题`

> 此时位移不使用`逆矩阵`进行相对位置的移动，因为`逆矩阵`计算时使用除法，导致浮点数可能出现精度问题
>
> 直接使用未缩放状态下的偏移量机型减法计算，得到上一帧需要进行的相对位移