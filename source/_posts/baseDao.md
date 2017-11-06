---
title: SSH整合：使用DAO框架(BaseDao)，DAO不写或少写，小弟我们更加专注业务(转)
date: 2016-01-13 11:30:28
tags: [转,java,SSH]
---
转自:http://www.myexception.cn/software-architecture-design/417462.html

SSH整合：使用DAO框架(BaseDao)，DAO不写或少写，我们更加专注业务
这里我们新建一个BaseDao，让普通Dao(如：UserDao)继承它，
这样普通Dao什么都不写就可以自动实现基本的增删改查操作，也可以在UserDao中扩建方法...
BaseDao.java：

~~~java
package com.kaishengit.dao;
 
import java.io.Serializable;
import java.util.List;
 
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
 
import com.kaishengit.util.ReflectUtil;
 
public class BaseDao<T,PK extends Serializable> {
     
    private SessionFactory sessionFactory;
    //Class<?>:防止报黄线,意思是传入任意类型都行,无所谓,也可以使用Object
    private Class<?> entityClass;
     
    public BaseDao(){
        //new出一个子类对象，父类中的this是子类中的this
        entityClass = ReflectUtil.getGenericParameterType(this.getClass());
    }
     
    public void saveOrUpdate(T t){
        getSession().saveOrUpdate(t);
    }
     
    public void del(PK pk){
        getSession().delete(findById(pk));
    }
     
    public void del(T t){
        getSession().delete(t);
    }
     
    @SuppressWarnings("unchecked")
    public T findById(PK pk){
        return (T) getSession().get(entityClass, pk);
    }
     
    @SuppressWarnings("unchecked")
    public List<T> findAll(){
        Criteria criteria = getSession().createCriteria(entityClass);
        return criteria.list();
    }
     
    @SuppressWarnings("unchecked")
    public List<T> findByPage(int start,int count){
        Criteria criteria = getSession().createCriteria(entityClass);
        criteria.setFirstResult(start);
        criteria.setMaxResults(count);
        return criteria.list();
    }
     
    //get
    public Session getSession(){
        return sessionFactory.getCurrentSession();
    }
     
    //set
    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    } 
}
~~~

 这里面我用到自己写的一个工具类,通过反射实现返回的实际参数化类型T
ReflectUtil.java
~~~java
package com.kaishengit.util;
 
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
 
public class ReflectUtil {
    public static Class<?> getGenericParameterType(Class<?> clazz){
        //获得父类的泛型类类型
        Type type = clazz.getGenericSuperclass();
        //强制转化为参数化类型：Collection<String>
        ParameterizedType pt = (ParameterizedType) type;
        //返回实际参数化类型
        Type[] types = pt.getActualTypeArguments();
        return (Class<?>) types[0];
    }
}
~~~

这样就ok啦，我们新建一个UserDao继承它，这样UserDao就自动拥有了增删改查功能，
是不是很令人兴奋呀，里面又扩建了一个方法
~~~java
package com.kaishengit.dao;
 
import org.hibernate.Query;
import org.springframework.stereotype.Repository;
 
import com.kaishengit.pojo.User;
 
@Repository
public class UserDao extends BaseDao<User,Integer>{
    public User findByNameAndPassword(User user){
        String hql = "from User where username = ? and password = ?";
        Query query = getSession().createQuery(hql);
        query.setParameter(0, user.getUsername());
        query.setParameter(1, user.getPassword());
        return (User) query.uniqueResult();
    }
}
~~~
