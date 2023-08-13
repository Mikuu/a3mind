Feature
--
1. 在菜单中添加边框选择，椭圆框、直角框、以及其他类型，以此来区别scenario, test, result；

BUG
--
1. 在view页面获取的nodes会越界，比如获取包含多个root node的队列，不稳定复现，可以尝试在同一个project里面反复删除创建view;
2. 在view页面，创建一个新的node，打开菜单，直接save和load，菜单一直显示不消失；

ISSUE
--
