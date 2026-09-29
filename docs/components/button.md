# Button 按钮

常用的操作按钮。

## 基础用法

使用 `type` 属性定义按钮类型。

```demo
<vc-button>默认按钮</vc-button>
<vc-button type="primary">主要按钮</vc-button>
<vc-button type="success">成功按钮</vc-button>
<vc-button type="warning">警告按钮</vc-button>
<vc-button type="danger">危险按钮</vc-button>
<vc-button type="info">信息按钮</vc-button>
```

## 朴素按钮

设置 `plain` 属性获得朴素（描边）按钮。

```demo
<vc-button plain>朴素按钮</vc-button>
<vc-button type="primary" plain>主要按钮</vc-button>
<vc-button type="success" plain>成功按钮</vc-button>
<vc-button type="warning" plain>警告按钮</vc-button>
<vc-button type="danger" plain>危险按钮</vc-button>
```

## 圆角与圆形按钮

设置 `round` 获得圆角按钮，设置 `circle` 获得圆形按钮。

```demo
<vc-button round>圆角按钮</vc-button>
<vc-button type="primary" round>主要按钮</vc-button>
<vc-button type="danger" circle>O</vc-button>
<vc-button type="primary" circle>P</vc-button>
```

## 尺寸

使用 `size` 属性设置按钮尺寸，支持 `large` / `default` / `small`。

```demo
<vc-button size="large">大型按钮</vc-button>
<vc-button>默认按钮</vc-button>
<vc-button size="small">小型按钮</vc-button>
```

## 禁用与加载

使用 `disabled` 属性禁用按钮；`loading` 属性让按钮进入加载中状态并阻止点击。

```demo
<vc-button disabled>禁用按钮</vc-button>
<vc-button type="primary" disabled>主要按钮</vc-button>
<vc-button type="primary" loading>加载中</vc-button>
```

## 原生属性

`native-type` 透传原生 `type` 属性（`button` / `submit` / `reset`），适用于表单场景。

```demo
<vc-button native-type="submit" type="primary">提交</vc-button>
<vc-button native-type="reset">重置</vc-button>
```

## Attributes

| 属性        | 说明                           | 类型      | 可选值                                   | 默认值    |
| ----------- | ------------------------------ | --------- | ---------------------------------------- | --------- |
| type        | 按钮类型                       | `string`  | `primary` / `success` / `warning` / `danger` / `info` / `default` | `default` |
| size        | 按钮尺寸                       | `string`  | `large` / `default` / `small`            | `default` |
| plain       | 是否朴素按钮                   | `boolean` | —                                        | `false`   |
| round       | 是否圆角按钮                   | `boolean` | —                                        | `false`   |
| circle      | 是否圆形按钮                   | `boolean` | —                                        | `false`   |
| disabled    | 是否禁用                       | `boolean` | —                                        | `false`   |
| loading     | 是否加载中（阻止点击）         | `boolean` | —                                        | `false`   |
| native-type | 原生 type 属性                 | `string`  | `button` / `submit` / `reset`            | `button`  |
| autofocus   | 原生 autofocus 属性            | `boolean` | —                                        | `false`   |

## Slots

| 插槽名 | 说明           |
| ------ | -------------- |
| —      | 按钮文本内容   |
