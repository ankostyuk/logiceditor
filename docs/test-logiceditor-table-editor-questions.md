Тестовое задание http://logiceditor.com/ru/info/js-tasks.html

Вариант 2 «Табличный редактор»

Правильно ли я понимаю, что...

Табличные данные состоят только из тех столбцов, которые представлены в данных как свойства объекта, и неограниченного количества строк?

> Alexander Gladysh
> Да

Т.е., при входных данных из примера:

```
[{name:"name1", value="value1"},{name:"name2", value="value2"}]
```

Таблица будет выглядеть так:

|name |value |
|-----|------|
|name1|value1|
|name2|value2|

> Alexander Gladysh
> Да

Редактированию подлежат поля name и value каждой записи?

> Alexander Gladysh
> Да

Соответсвенно, CSV:

```
name;value
name1;value1
name2;value2
```

Если пользователь укажет такой JSON:

```
[
    {name:"name1", value="value1"},
    {phone:"phone1", email="email1"},
    {name:"name1", value="value1"}
]
```

Таблица будет выглядеть так:

|name |value |phone |email |
|-----|------|------|------|
|name1|value1|      |      |
|     |      |phone1|email1|
|name2|value2|      |      |

Редактированию подлежат поля name, value, phone, email каждой записи?

> Alexander Gladysh
> Входной JSON невалиден. Ключи, отличные от name и value, должны быть проигнорированы.

Соответсвенно, CSV:

```
name;value;phone;email
name1;value1;;
;;phone1;email1
name2;value2;;
```

***

Допускаются ли дубликаты записей? Обрабатывать данную ситуацию?

> Alexander Gladysh
> Допускаются.

Необходимо ли реализовывать поддержку добавления пользователем новых столбцов, удаления пользователем столбцов,
при редактировании самой таблицы?

> Alexander Gladysh
> Нет, только name и value.
