import useGetPageInfo from '@/hooks/useGetPageInfo';
import { resetPageInfo } from '@/store/pageInfoReducer';
import { Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const { TextArea } = Input;

const PageSetting: React.FC = () => {
  const pageInfo = useGetPageInfo();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue(pageInfo);
  }, [pageInfo]);

  function handleValuesChange() {
    dispatch(resetPageInfo(form.getFieldsValue()));
  }
  return (
    <Form
      layout="vertical"
      initialValues={pageInfo}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="问卷标题"
        name="title"
        rules={[{ required: true, message: '标题不能为空' }]}
      >
        <Input placeholder="强输入标题" />
      </Form.Item>
      <Form.Item label="问卷描述" name="desc">
        <TextArea placeholder="问卷描述..." />
      </Form.Item>
      <Form.Item label="样式代码" name="css">
        <TextArea placeholder="请输入 CSS 样式代码..." />
      </Form.Item>
      <Form.Item label="脚本代码" name="js">
        <TextArea placeholder="请输入 JS 脚本代码..." />
      </Form.Item>
    </Form>
  );
};

export default PageSetting;
