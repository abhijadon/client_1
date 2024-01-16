import { Form, Input, Upload, Select } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
const { Dragger } = Upload;

export default function LeadForm() {
    const translate = useLanguage();

    return (
        <>
            <Form.Item
                label={translate('send fee reciept')}
                name={['customfields', 'send_fee_receipt']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input disabled />
            </Form.Item>
            <Form.Item
                label={translate('studentid')}
                name={['lead_id']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input disabled />
            </Form.Item>
            <Form.Item
                label={translate('student name')}
                name={['full_name']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('email')}
                name={['contact', 'email']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('phone')}
                name={['contact', 'phone']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('course')}
                name={['education', 'course']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input type="tel" />
            </Form.Item>

            <Form.Item
                label={translate('session')}
                name={['customfields', 'session']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('Institute name')}
                name={['customfields', 'institute_name']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('university name')}
                name={['customfields', 'university_name']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>


            <Form.Item
                label={translate('Counselor Email')}
                name={['customfields', 'counselor_email']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>



            <Form.Item
                label={translate('father name')}
                name={['customfields', 'father_name']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={translate('mother name')}
                name={['customfields', 'mother_name']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('session type')}
                name={['customfields', 'session_type']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('Specialization')}
                name={['customfields', 'enter_specialization']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('date of birth')}
                name={['customfields', 'dob']}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('gender')}
                name={['customfields', 'gender']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('Installment Type')}
                name={['customfields', 'installment_type']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={translate('Payment Mode')}
                name={['customfields', 'payment_mode']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={translate('Total Course Fee')}
                name={['customfields', 'total_course_fee']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={translate('Paid Amount')}
                name={['customfields', 'paid_amount']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={translate('Total Paid Amount')}
                name={['customfields', 'total_paid_amount']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={translate("upload student document")}
                name={['customfields', 'upload_student_document']}
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
            >
                <Dragger
                    multiple
                    beforeUpload={() => false} // Prevent automatic upload on file selection
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag files to this area to upload</p>
                    <p className="ant-upload-hint">Support for multiple images</p>
                </Dragger>
            </Form.Item>
            <Form.Item
                label={translate("student fee receipt")}
                name={['customfields', 'upload_fee_receipt_screenshot']}
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}

            >
                <Dragger
                    multiple
                    beforeUpload={() => false} // Prevent automatic upload on file selection
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag files to this area to upload</p>
                    <p className="ant-upload-hint">Support for multiple images</p>
                </Dragger>
            </Form.Item>
            <Form.Item
                label={translate('status')}
                name={['customfields', 'status']}
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Select
                    options={[
                        { value: 'New', label: translate('New') },
                        { value: 'Cancel', label: translate('cancel') },
                        { value: 'Alumini', label: translate('Alumini') },
                        { value: 'not interested', label: translate('not interested') },
                    ]}
                ></Select>
            </Form.Item>
            <Form.Item
                label={translate('Remark')}
                name={['customfields', 'remark']}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
        </>
    );
}